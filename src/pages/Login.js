import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { authApi } from "../services/api";
import "./Auth.css";

const validMobileNumber = (value) => /^[6-9]\d{9}$/.test(value);

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState(location.state?.message || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setNotice("");

    if (!validMobileNumber(mobileNumber)) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }
    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setIsSubmitting(true);
    try {
      await authApi.login(mobileNumber, password);
      navigate("/student/dashboard");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-card">
        <p className="auth-eyebrow">GYANEXIA STUDENT PORTAL</p>
        <h1>Welcome back</h1>
        <p className="auth-intro">Sign in to keep learning, competing and growing.</p>

        <div className="auth-choices" aria-label="Login type">
          <button type="button" className="auth-choice active">Student Login</button>
          <button type="button" className="auth-choice" onClick={() => setNotice("Admin login is coming soon.")}>Admin Login</button>
        </div>

        {notice && <p className="auth-notice" role="status">{notice}</p>}
        {error && <p className="auth-error" role="alert">{error}</p>}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <label htmlFor="login-mobile">Mobile Number</label>
          <input id="login-mobile" type="tel" inputMode="numeric" maxLength="10" value={mobileNumber} onChange={(event) => setMobileNumber(event.target.value.replace(/\D/g, ""))} placeholder="10-digit mobile number" autoComplete="tel" required />

          <label htmlFor="login-password">Password</label>
          <input id="login-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Your password" autoComplete="current-password" required />

          <button className="auth-submit" type="submit" disabled={isSubmitting}>{isSubmitting ? "Logging in…" : "Student Login"}</button>
        </form>

        <p className="auth-switch">New Student? <Link to="/student/register">Create Account</Link></p>
      </div>
    </section>
  );
}
