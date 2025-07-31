import { useState } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import API from "../services/api"; // Make sure this path is correct

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/forgot-password", { email });
      alert("Reset link sent! Please check your email.");
      // Optionally navigate back to login after sending link
      // navigate("/");
    } catch (err) {
      alert("Error: " + (err.response?.data?.message || err.message)); // Safely access error message
    }
  };

  return (
    // Outer container for the full screen background and relative positioning
    <div style={{
      minHeight: "100vh",
      width: "100vw",
      background: "linear-gradient(135deg, #FFC7B2 0%, #E0BBE4 100%)", // Warm Peach to Soft Lavender
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
          input[type="text"] { 
            font-size: 16px !important; /* Force 16px to prevent zoom */
            -webkit-text-size-adjust: 100% !important; /* Prevent iOS/WebKit from resizing */
            line-height: normal !important; /* Ensure consistent line height */
          }
        `}
      </style>
      
      {/* The centered forgot password form container */}
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
        <h2 style={{ color: "#2575fc", marginBottom: "1.5rem", fontFamily: "'Poppins', sans-serif" }}>Forgot Password</h2>
        <form onSubmit={handleSubmit}>
          {/* Email Input */}
          <div style={{ position: "relative", marginBottom: "1.2rem" }}>
            <input
              type="email"
              value={email}
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "0.75rem 1rem", // Adjust padding slightly as there's no icon
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
            {/* No icon for email in this form */}
          </div>
          
          {/* Send Reset Link Button */}
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
            Send Reset Link
          </button>
        </form>

        {/* Return to Login Link */}
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
          Remember your password? Login
        </Link>
      </div>
    </div>
  );
}