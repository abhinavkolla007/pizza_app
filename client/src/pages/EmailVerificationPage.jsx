// pizza-app/client/src/pages/EmailVerificationPage.jsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import API from '../services/api';

const EmailVerificationPage = () => {
  const [status, setStatus] = useState('verifying');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      const token = new URLSearchParams(location.search).get('token');
      if (!token) {
        setStatus('invalid');
        return;
      }

      try {
        const res = await API.get(`/auth/verify-email?token=${token}`);
        if (res.status === 200) {
          setStatus('success');
          // Redirect to login page after a short delay
          setTimeout(() => {
            navigate('/');
          }, 3000); 
        } else {
          setStatus('failure');
        }
      } catch (err) {
        console.error('Verification failed:', err);
        setStatus('failure');
      }
    };
    verifyToken();
  }, [location, navigate]);

  const renderContent = () => {
    switch (status) {
      case 'verifying':
        return (
          <>
            <h2>Verifying Your Email...</h2>
            <p>Please wait, do not close this page.</p>
          </>
        );
      case 'success':
        return (
          <>
            <h2>✅ Email Verified!</h2>
            <p>You can now log in. Redirecting you to the login page...</p>
          </>
        );
      case 'failure':
        return (
          <>
            <h2>❌ Verification Failed</h2>
            <p>The verification link is invalid or has expired.</p>
            <p>Please try registering again or contact support.</p>
          </>
        );
      case 'invalid':
        return (
          <>
            <h2>❌ Invalid Link</h2>
            <p>The verification link is missing a token.</p>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      width: "100vw",
      background: "linear-gradient(135deg, #FFC7B2 0%, #E0BBE4 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Poppins', sans-serif"
    }}>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap');
          body { margin: 0; padding: 0; }
        `}
      </style>
      <div style={{
        background: "#fff",
        padding: "2.5rem",
        borderRadius: "16px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
        maxWidth: "500px",
        textAlign: "center"
      }}>
        {renderContent()}
      </div>
    </div>
  );
};

export default EmailVerificationPage;