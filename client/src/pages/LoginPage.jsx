import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api"; // Make sure this path is correct

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      alert("Login successful!");

      if (res.data.user.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      alert("Login failed: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    // Outer container for the full screen background and relative positioning
    <div style={{
      minHeight: "100vh",
      width: "100vw",
      // Current unique & pleasant background color: Warm Peach to Soft Lavender
      background: "linear-gradient(135deg, #FFC7B2 0%, #E0BBE4 100%)", 
      margin: 0,
      padding: 0,
      boxSizing: "border-box",
      position: "relative", // Crucial for absolute positioning of the child
      overflow: "hidden" // Hide overflow on the main container itself
    }}>
      {/* Global styles injected into the head */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap');
          
          /* Resetting default browser margins and paddings for html and body */
          html, body {
            margin: 0;
            padding: 0;
            height: 100%; /* Ensure html and body take full height */
            font-size: 16px; /* Base font size for 'rem' units */
          }
          body {
            font-family: 'Poppins', sans-serif;
            overflow: hidden; /* Prevent body scrollbars from interfering with centering */
          }

          /* --- Animation Adjustment (no initial transform) --- */
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          /* --- IMPORTANT: Global input style override for consistency --- */
          /* This helps prevent mobile browser font-size auto-adjustment */
          input[type="email"],
          input[type="password"],
          input[type="text"] { /* Adding text type for completeness */
            font-size: 16px !important; /* Force 16px to prevent zoom */
            -webkit-text-size-adjust: 100% !important; /* Prevent iOS/WebKit from resizing */
            line-height: normal !important; /* Ensure consistent line height */
          }
        `}
      </style>
      
      {/* The centered login form container */}
      <div style={{
        background: "#fff",
        padding: "2.5rem 2rem",
        borderRadius: "16px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
        width: "350px",
        textAlign: "center",
        animation: "fadeIn 1s forwards", // 'forwards' ensures it stays at the end state
        // Absolute centering properties
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)", // Shifts the element back by half its own width/height
        maxWidth: "90%", // Add a max-width for responsiveness on small screens
        maxHeight: "95vh", // Add a max-height to prevent overflow on very short screens
        overflowY: "auto" // Allow scrolling inside the form if it overflows vertically
      }}>
        {/* Optional logo */}
        {/* <img src="/logo.png" alt="Logo" style={{ width: 60, marginBottom: 16 }} /> */}
        <h2 style={{ color: "#2575fc", marginBottom: "1.5rem", fontFamily: "'Poppins', sans-serif" }}>Login</h2>
        <form onSubmit={handleLogin}>
          {/* Email Input */}
          <div style={{ position: "relative", marginBottom: "1.2rem" }}>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              type="email"
              style={{
                width: "100%",
                padding: "0.75rem 2.5rem 0.75rem 1rem",
                border: "1px solid #ddd",
                borderRadius: "8px",
                // Removed inline font-size, now handled by global <style> for consistency
                background: "#f0f4ff",
                transition: "box-shadow 0.2s",
                fontFamily: "'Poppins', sans-serif",
                boxSizing: "border-box", // Ensure padding doesn't increase total width
                outline: "none" // Remove default browser outline
              }}
              onFocus={e => {
                e.target.style.boxShadow = "0 0 0 2px #2575fc33";
              }}
              onBlur={e => {
                e.target.style.boxShadow = "";
              }}
            />
            <span style={{
              position: "absolute",
              right: "1rem",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#aaa"
            }}>
              &#128231; {/* Email icon */}
            </span>
          </div>

          {/* Password Input */}
          <div style={{ position: "relative", marginBottom: "1.2rem" }}>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Password"
              required
              style={{
                width: "100%",
                padding: "0.75rem 2.5rem 0.75rem 1rem",
                border: "1px solid #ddd",
                borderRadius: "8px",
                // Removed inline font-size, now handled by global <style> for consistency
                background: "#f0f4ff",
                transition: "box-shadow 0.2s",
                fontFamily: "'Poppins', sans-serif",
                boxSizing: "border-box", // Ensure padding doesn't increase total width
                outline: "none" // Remove default browser outline
              }}
              onFocus={e => {
                e.target.style.boxShadow = "0 0 0 2px #6a11cb33";
              }}
              onBlur={e => {
                e.target.style.boxShadow = "";
              }}
            />
            <span style={{
              position: "absolute",
              right: "1rem",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#aaa"
            }}>
              &#128274; {/* Lock icon */}
            </span>
          </div>

          {/* Sign In Button */}
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
              transition: "background 0.2s, transform 0.1s ease-in-out", // Added transform for press effect
            }}
            onMouseOver={e => e.target.style.background = "linear-gradient(90deg, #2575fc 0%, #6a11cb 100%)"}
            onMouseOut={e => e.target.style.background = "linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)"}
            onMouseDown={e => e.target.style.transform = "scale(0.98)"} // Small scale down on press
            onMouseUp={e => e.target.style.transform = "scale(1)"} // Reset on release
          >
            Sign In
          </button>
        </form>

        {/* Forgot Password Link */}
        <Link to="/forgot-password" style={{
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
          Forgot Password?
        </Link>

        {/* Register Link */}
        <Link to="/register" style={{
          display: "block",
          marginTop: "0.5rem",
          color: "#6a11cb",
          textDecoration: "none",
          fontSize: "0.95rem",
          fontFamily: "'Poppins', sans-serif",
          transition: "color 0.2s ease-in-out"
        }}
        onMouseOver={e => e.target.style.color = "#2575fc"}
        onMouseOut={e => e.target.style.color = "#6a11cb"}
        >
          Don't have an account? Register
        </Link>
      </div>
    </div>
  );
}