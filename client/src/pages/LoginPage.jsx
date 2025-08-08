import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role); 
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
    // Outer container for the full screen background image and overlay
    <div style={{
      minHeight: "100vh",
      width: "100vw",
      // --- BACKGROUND IMAGE STYLES ---
      backgroundImage: `url('https://media.istockphoto.com/id/1303021179/photo/different-tipes-of-pizza.jpg?s=612x612&w=0&k=20&c=G7wfRN4fb7LSpZ766geBNdhxy2IuwfRYbrNj9c63_ZQ=')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      // --- END BACKGROUND IMAGE STYLES ---
      position: "relative",
      overflow: "hidden",
      display: "flex", // Use flex to center content within the image container
      alignItems: "center",
      justifyContent: "center",
      margin: 0,
      padding: 0,
      boxSizing: "border-box"
    }}>
      {/* Subtle overlay for better text readability on top of the image */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.4)', // Dark overlay (adjust opacity as needed)
        zIndex: 1, // Ensure overlay is behind the form but above the image
      }}></div>

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

      {/* The centered login form container (z-index ensures it's above the overlay) */}
      <div style={{
        background: "#fff",
        padding: "2.5rem 2rem",
        borderRadius: "16px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.3)", // Increased shadow for better contrast
        width: "350px",
        textAlign: "center",
        animation: "fadeIn 1s forwards",
        position: "relative", // Changed to relative, centered by parent flex
        zIndex: 2, // Ensure form is above the overlay
        maxWidth: "90%",
        maxHeight: "95vh",
        overflowY: "auto"
      }}>
        <h2 style={{ color: "#2575fc", marginBottom: "1.5rem", fontFamily: "'Poppins', sans-serif" }}>Login</h2>
        <form onSubmit={handleLogin} autoComplete="on">
          {/* Email Input */}
          <div style={{ position: "relative", marginBottom: "1.2rem" }}>
            <input
              name="email"
              autoComplete="username"
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
                background: "#f0f4ff",
                transition: "box-shadow 0.2s",
                fontFamily: "'Poppins', sans-serif",
              }}
              onFocus={e => { e.target.style.boxShadow = "0 0 0 2px #2575fc33"; }}
              onBlur={e => { e.target.style.boxShadow = ""; }}
            />
            <span style={{
              position: "absolute",
              right: "1rem",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#aaa"
            }}>
              &#128231;
            </span>
          </div>

          {/* Password Input */}
          <div style={{ position: "relative", marginBottom: "1.2rem" }}>
            <input
              name="password"
              autoComplete="current-password"
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
                background: "#f0f4ff",
                transition: "box-shadow 0.2s",
                fontFamily: "'Poppins', sans-serif",
              }}
              onFocus={e => { e.target.style.boxShadow = "0 0 0 2px #6a11cb33"; }}
              onBlur={e => { e.target.style.boxShadow = ""; }}
            />
            <span style={{
              position: "absolute",
              right: "1rem",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#aaa"
            }}>
              &#128274;
            </span>
          </div>

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
            Sign In
          </button>
        </form>

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