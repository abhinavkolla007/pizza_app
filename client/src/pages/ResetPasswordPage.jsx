import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const { token } = useParams();
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      await API.post(`/auth/reset-password/${token}`, { password });
      alert("Password reset successful!");
      navigate("/");
    } catch (err) {
      alert("Error: " + err.response?.data?.message || err.message);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Reset Password</h2>
      <form onSubmit={handleReset}>
        <input
          type="password"
          value={password}
          placeholder="Enter new password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
}
