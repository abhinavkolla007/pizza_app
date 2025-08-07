import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("user");
  const navigate = useNavigate();
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  const handlePasswordFocus = (e) => {
    e.target.readOnly = false;
    e.target.style.boxShadow = "0 0 0 2px #6a11cb33";
  };

  const handlePasswordBlur = (e) => {
    e.target.readOnly = true;
    e.target.style.boxShadow = "";
  };

  useEffect(() => {
    if (passwordRef.current) passwordRef.current.readOnly = true;
    if (confirmPasswordRef.current) confirmPasswordRef.current.readOnly = true;
  }, []);


  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      await API.post("/auth/register", { name, email, password, role });
      alert("Registration successful! Please check your email and verify before logging in.");
      navigate("/");
    } catch (err) {
      alert("Register failed: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      width: "100vw",
      background: "linear-gradient(135deg, #FFC7B2 0%, #E0BBE4 100%)",
      margin: 0,
      padding: 0,
      boxSizing: "border-box",
      position: "relative",
      overflow: "hidden"
    }}>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap');
          
          html, body {
            margin: 0;
            padding: 0;
            height: 100%;
            font-size: 16px; 
          }
          body {
            font-family: 'Poppins', sans-serif;
            overflow: hidden;
          }

          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          input[type="email"],
          input[type="password"],
          input[type="text"],
          input[type="number"],
          select { 
            font-size: 16px !important; 
            -webkit-text-size-adjust: 100% !important; 
            line-height: normal !important; 
            box-sizing: border-box !important; 
            outline: none !important; 

            padding: 0.75rem 1rem; 
            border: 1px solid #ddd;
            border-radius: 8px;
            background: #f0f4ff;
            font-family: 'Poppins', sans-serif; 
            width: 100%; 
            -webkit-appearance: none; 
            -moz-appearance: none; 
            appearance: none; 
          }
          
          .select-wrapper::after {
            content: '▼';
            font-size: 0.7rem; 
            color: #aaa;
            position: absolute;
            right: 1rem;
            top: calc(50% + 3px); 
            transform: translateY(-50%); 
            pointer-events: none; 
          }
        `}
      </style>
      
      <div style={{
        background: "#fff",
        padding: "2.5rem 2rem",
        borderRadius: "16px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
        width: "350px",
        textAlign: "center",
        animation: "fadeIn 1s forwards",
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        maxWidth: "90%",
        maxHeight: "95vh",
        overflowY: "auto"
      }}>
        <h2 style={{ color: "#2575fc", marginBottom: "1.5rem", fontFamily: "'Poppins', sans-serif" }}>Register</h2>
        <form onSubmit={handleRegister}>
          {/* Name Input */}
          <div style={{ position: "relative", marginBottom: "1.2rem" }}>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              required
              type="text"
              name="fullname"
              autoComplete="name"
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                border: "1px solid #ddd",
                borderRadius: "8px",
                background: "#f0f4ff",
                transition: "box-shadow 0.2s",
                fontFamily: "'Poppins', sans-serif",
                boxSizing: "border-box",
                outline: "none"
              }}
              onFocus={e => { e.target.style.boxShadow = "0 0 0 2px #2575fc33"; }}
              onBlur={e => { e.target.style.boxShadow = ""; }}
            />
          </div>

          {/* Email Input */}
          <div style={{ position: "relative", marginBottom: "1.2rem" }}>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              type="email"
              name="email"
              autoComplete="email"
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                border: "1px solid #ddd",
                borderRadius: "8px",
                background: "#f0f4ff",
                transition: "box-shadow 0.2s",
                fontFamily: "'Poppins', sans-serif",
                boxSizing: "border-box",
                outline: "none"
              }}
              onFocus={e => { e.target.style.boxShadow = "0 0 0 2px #2575fc33"; }}
              onBlur={e => { e.target.style.boxShadow = ""; }}
            />
          </div>

          {/* Password Input */}
          <div style={{ position: "relative", marginBottom: "1.2rem" }}>
            <input
              ref={passwordRef}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Password"
              required
              name="password-new"
              autoComplete="new-password"
              readOnly
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                border: "1px solid #ddd",
                borderRadius: "8px",
                background: "#f0f4ff",
                transition: "box-shadow 0.2s",
                fontFamily: "'Poppins', sans-serif",
                boxSizing: "border-box",
                outline: "none"
              }}
              onFocus={handlePasswordFocus}
              onBlur={handlePasswordBlur}
            />
          </div>

          {/* Re-enter Password Input */}
          <div style={{ position: "relative", marginBottom: "1.2rem" }}>
            <input
              ref={confirmPasswordRef}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              type="password"
              placeholder="Re-enter Password"
              required
              name="password-confirm"
              autoComplete="new-password"
              readOnly
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                border: "1px solid #ddd",
                borderRadius: "8px",
                background: "#f0f4ff",
                transition: "box-shadow 0.2s",
                fontFamily: "'Poppins', sans-serif",
                boxSizing: "border-box",
                outline: "none"
              }}
              onFocus={handlePasswordFocus}
              onBlur={handlePasswordBlur}
            />
          </div>

          {/* Select Role */}
          <div style={{ position: "relative", marginBottom: "1.2rem", textAlign: "left" }} className="select-wrapper">
            <label htmlFor="role-select" style={{ 
                display: "block", 
                marginBottom: "0.5rem", 
                fontSize: "0.9rem", 
                color: "#555",
                fontFamily: "'Poppins', sans-serif"
            }}>Select Role:</label>
            <select
              id="role-select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              name="role"
              autoComplete="off"
              style={{
                transition: "box-shadow 0.2s",
                fontFamily: "'Poppins', sans-serif",
                boxSizing: "border-box",
                outline: "none",
              }}
              onFocus={e => { e.target.style.boxShadow = "0 0 0 2px #2575fc33"; }}
              onBlur={e => { e.target.style.boxShadow = ""; }}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          
          {/* Register Button */}
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "0.75rem",
              background: "linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontSize: "1rem",
              fontWeight: "bold",
              cursor: "pointer",
              marginBottom: "0.5rem",
              fontFamily: "'Poppins', sans-serif",
              transition: "background 0.2s, transform 0.1s ease-in-out",
            }}
            onMouseOver={e => e.target.style.background = "linear-gradient(90deg, #2575fc 0%, #6a11cb 100%)"}
            onMouseOut={e => e.target.style.background = "linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)"}
            onMouseDown={e => e.target.style.transform = "scale(0.98)"}
            onMouseUp={e => e.target.style.transform = "scale(1)"}
          >
            Register
          </button>
        </form>

        {/* Login Link */}
        <Link to="/" style={{
          display: "block",
          marginTop: "1rem",
          color: "#2575fc",
          textDecoration: "none",
          fontSize: "0.95rem",
          fontFamily: "'Poppins', sans-serif",
          transition: "color 0.2s ease-in-out"
        }}
        onMouseOver={e => e.target.style.color = "#6a11cb"}
        onMouseOut={e => e.target.style.color = "#2575fc"}
        >
          Already have an account? Login
        </Link>
      </div>
    </div>
  );
}