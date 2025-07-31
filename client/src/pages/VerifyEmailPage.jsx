import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import API from "../services/api";

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get("token");
      try {
        await API.get(`/auth/verify-email?token=${token}`);
        alert("✅ Email verified! You can now log in.");
        navigate("/");
      } catch (err) {
        alert("❌ Verification failed.");
        navigate("/");
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  return <h2>Verifying email...</h2>;
}
