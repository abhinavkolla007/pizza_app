import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");
    if (token) {
      setIsLoggedIn(true);
      setRole(storedRole);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    setRole(null);
    navigate("/");
  };

  return (
    <nav className="bg-gray-800 text-white px-6 py-3 flex justify-between items-center">
      <span className="text-xl font-bold">🍕 Pizza App</span>
      {isLoggedIn && (
        <div className="space-x-4">
          {role === "user" && (
            <>
              <Link to="/dashboard" className="hover:underline">My Orders</Link>
              <Link to="/order" className="hover:underline">Order Pizza</Link>
            </>
          )}
          {role === "admin" && (
            <Link to="/admin-dashboard" className="hover:underline">Admin Dashboard</Link>
          )}
          <button onClick={handleLogout} className="hover:underline">Logout</button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;