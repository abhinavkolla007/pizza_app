import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom'; // Import Link
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import DashboardPage from './pages/DashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import API from './services/api';

// PrivateRoute component to protect routes
const PrivateRoute = ({ children, allowedRoles }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const verifyAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await API.get('/auth/me'); 
          setIsAuthenticated(true);
          setUserRole(res.data.user.role);
          localStorage.setItem('role', res.data.user.role); 
        } catch (error) {
          console.error("Auth verification failed:", error);
          localStorage.removeItem('token');
          localStorage.removeItem('role'); 
          setIsAuthenticated(false);
          setUserRole(null);
        }
      } else {
        setIsAuthenticated(false);
        setUserRole(null);
      }
    };
    verifyAuth();
  }, []);

  if (isAuthenticated === null) {
    return (
      <div style={{
        minHeight: "100vh",
        width: "100vw",
        background: "linear-gradient(135deg, #FFC7B2 0%, #E0BBE4 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#6a11cb",
        fontSize: "1.5rem",
        fontFamily: "'Poppins', sans-serif"
      }}>
        Loading authentication...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        {/* Email verification redirect target - will redirect to login page with a success message */}
        <Route path="/verify-email" element={<LoginPage />} /> 
        {/* Password reset link target. You might want a dedicated ResetPasswordPage component here */}
        <Route path="/reset-password" element={<ForgotPasswordPage />} /> 

        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute allowedRoles={['user']}>
              <DashboardPage />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/admin-dashboard" 
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <AdminDashboardPage />
            </PrivateRoute>
          } 
        />
        <Route path="/unauthorized" element={
          <div style={{
            minHeight: "100vh",
            width: "100vw",
            background: "linear-gradient(135deg, #FFC7B2 0%, #E0BBE4 100%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "#dc3545",
            fontSize: "1.5rem",
            fontFamily: "'Poppins', sans-serif"
          }}>
            <h2>Access Denied</h2>
            <p>You are not authorized to view this page.</p>
            <Link to="/" style={{ color: "#2575fc", textDecoration: "none", marginTop: "1rem" }}>Go to Login</Link>
          </div>
        } />
        <Route path="*" element={
          <div style={{
            minHeight: "100vh",
            width: "100vw",
            background: "linear-gradient(135deg, #FFC7B2 0%, #E0BBE4 100%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "#333",
            fontSize: "1.5rem",
            fontFamily: "'Poppins', sans-serif"
          }}>
            <h2>404 - Page Not Found</h2>
            <p>The page you are looking for does not exist.</p>
            <Link to="/" style={{ color: "#2575fc", textDecoration: "none", marginTop: "1rem" }}>Go to Login</Link>
          </div>
        } />
      </Routes>
    </Router>
  );
};

export default App;