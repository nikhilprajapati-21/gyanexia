import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../services/api";
import "./Auth.css";

const initialForm = { name: "", class: "", mobileNumber: "", password: "", confirmPassword: "", medium: "", schoolOrCoaching: "" };

export default function StudentRegister() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: name === "mobileNumber" ? value.replace(/\D/g, "") : value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!/^[6-9]\d{9}$/.test(form.mobileNumber)) return setError("Please enter a valid 10-digit mobile number.");
    if (form.password.length < 8) return setError("Password must be at least 8 characters long.");
    if (form.password !== form.confirmPassword) return setError("Passwords do not match.");

    setIsSubmitting(true);
    try {
      const { confirmPassword, ...student } = form;
      await authApi.register(student);
      navigate("/student/dashboard", { state: { message: "Your student account was created successfully." } });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="auth-page auth-page--register">
      <div className="auth-card auth-card--wide">
        <p className="auth-eyebrow">GYANEXIA STUDENT PORTAL</p>
        <h1>Create your account</h1>
        <p className="auth-intro">Join Gyanexia and get ready for your next learning challenge.</p>
        {error && <p className="auth-error" role="alert">{error}</p>}

        <form className="auth-form auth-form--grid" onSubmit={handleSubmit} noValidate>
          <div className="auth-field auth-field--full"><label htmlFor="name">Full Name</label><input id="name" name="name" value={form.name} onChange={updateField} autoComplete="name" required /></div>
          <div className="auth-field"><label htmlFor="class">Class</label><select id="class" name="class" value={form.class} onChange={updateField} required><option value="">Select class</option>{[5,6,7,8,9,10,11,12].map((studentClass) => <option key={studentClass} value={studentClass}>Class {studentClass}</option>)}</select></div>
          <div className="auth-field"><label htmlFor="medium">Medium</label><select id="medium" name="medium" value={form.medium} onChange={updateField} required><option value="">Select medium</option><option value="Hindi">Hindi</option><option value="English">English</option></select></div>
          <div className="auth-field"><label htmlFor="mobileNumber">Mobile Number</label><input id="mobileNumber" name="mobileNumber" type="tel" inputMode="numeric" maxLength="10" value={form.mobileNumber} onChange={updateField} autoComplete="tel" required /></div>
          <div className="auth-field"><label htmlFor="schoolOrCoaching">School / Coaching Name</label><input id="schoolOrCoaching" name="schoolOrCoaching" value={form.schoolOrCoaching} onChange={updateField} required /></div>
          <div className="auth-field"><label htmlFor="password">Password</label><input id="password" name="password" type="password" value={form.password} onChange={updateField} autoComplete="new-password" required /></div>
          <div className="auth-field"><label htmlFor="confirmPassword">Confirm Password</label><input id="confirmPassword" name="confirmPassword" type="password" value={form.confirmPassword} onChange={updateField} autoComplete="new-password" required /></div>
          <button
  className="auth-submit-btn auth-field--full"
  type="submit"
  disabled={isSubmitting}
>
  {isSubmitting ? "Creating account…" : "Create Student Account"}
</button>
        </form>
        <p className="auth-switch">Already registered? <Link to="/login">Student Login</Link></p>
      </div>
    </section>
  );
}
