import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../services/api";
import "./Auth.css";

const initialForm = {
  name: "",
  class: "",
  mobileNumber: "",
  password: "",
  confirmPassword: "",
  medium: "",
  schoolOrCoaching: "",
};

export default function StudentRegister() {
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]:
        name === "mobileNumber"
          ? value.replace(/\D/g, "").slice(0, 10)
          : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    // -----------------------------
    // BASIC VALIDATION
    // -----------------------------

    if (!form.name.trim()) {
      return setError("Please enter your full name.");
    }

    if (!form.class) {
      return setError("Please select your class.");
    }

    if (!form.medium) {
      return setError("Please select your medium.");
    }

    if (!/^[6-9]\d{9}$/.test(form.mobileNumber)) {
      return setError(
        "Please enter a valid 10-digit mobile number."
      );
    }

    if (!form.schoolOrCoaching.trim()) {
      return setError(
        "Please enter your school or coaching name."
      );
    }

    if (form.password.length < 8) {
      return setError(
        "Password must be at least 8 characters long."
      );
    }

    if (form.password !== form.confirmPassword) {
      return setError("Passwords do not match.");
    }

    // -----------------------------
    // SUBMIT
    // -----------------------------

    setIsSubmitting(true);

    try {
      // Never send confirmPassword to backend
      const {
        confirmPassword,
        ...student
      } = form;

      console.log("Registering student:", {
        ...student,
        password: "***",
      });

      const response =
        await authApi.registerStudent(student);

      console.log(
        "Registration successful:",
        response
      );

      /*
       * Backend creates the account and sets
       * the authentication cookie.
       *
       * Go directly to dashboard.
       */
      navigate("/student/dashboard", {
        replace: true,
        state: {
          message:
            "Your student account was created successfully.",
        },
      });
    } catch (requestError) {
      console.error(
        "Student registration error:",
        requestError
      );

      setError(
        requestError?.message ||
          "Unable to create your account. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="auth-page auth-page--register">
      <div className="auth-card auth-card--wide">

        {/* Header */}
        <p className="auth-eyebrow">
          GYANEXIA STUDENT PORTAL
        </p>

        <h1>Create your account</h1>

        <p className="auth-intro">
          Join Gyanexia and get ready for your next
          learning challenge.
        </p>

        {/* Error */}
        {error && (
          <p
            className="auth-error"
            role="alert"
          >
            {error}
          </p>
        )}

        {/* Form */}
        <form
          className="auth-form auth-form--grid"
          onSubmit={handleSubmit}
          noValidate
        >

          {/* Full Name */}
          <div className="auth-field auth-field--full">
            <label htmlFor="name">
              Full Name
            </label>

            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={updateField}
              autoComplete="name"
              placeholder="Enter your full name"
              required
            />
          </div>

          {/* Class */}
          <div className="auth-field">
            <label htmlFor="class">
              Class
            </label>

            <select
              id="class"
              name="class"
              value={form.class}
              onChange={updateField}
              required
            >
              <option value="">
                Select class
              </option>

              {[5, 6, 7, 8, 9, 10, 11, 12].map(
                (studentClass) => (
                  <option
                    key={studentClass}
                    value={studentClass}
                  >
                    Class {studentClass}
                  </option>
                )
              )}
            </select>
          </div>

          {/* Medium */}
          <div className="auth-field">
            <label htmlFor="medium">
              Medium
            </label>

            <select
              id="medium"
              name="medium"
              value={form.medium}
              onChange={updateField}
              required
            >
              <option value="">
                Select medium
              </option>

              <option value="Hindi">
                Hindi
              </option>

              <option value="English">
                English
              </option>
            </select>
          </div>

          {/* Mobile */}
          <div className="auth-field">
            <label htmlFor="mobileNumber">
              Mobile Number
            </label>

            <input
              id="mobileNumber"
              name="mobileNumber"
              type="tel"
              inputMode="numeric"
              maxLength={10}
              value={form.mobileNumber}
              onChange={updateField}
              autoComplete="tel"
              placeholder="10-digit mobile number"
              required
            />
          </div>

          {/* School */}
          <div className="auth-field">
            <label htmlFor="schoolOrCoaching">
              School / Coaching Name
            </label>

            <input
              id="schoolOrCoaching"
              name="schoolOrCoaching"
              type="text"
              value={form.schoolOrCoaching}
              onChange={updateField}
              placeholder="Enter school/coaching name"
              required
            />
          </div>

          {/* Password */}
          <div className="auth-field">
            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={updateField}
              autoComplete="new-password"
              placeholder="Minimum 8 characters"
              required
            />
          </div>

          {/* Confirm Password */}
          <div className="auth-field">
            <label htmlFor="confirmPassword">
              Confirm Password
            </label>

            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={updateField}
              autoComplete="new-password"
              placeholder="Re-enter password"
              required
            />
          </div>

          {/* Submit */}
          <button
            className="auth-submit-btn auth-field--full"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Creating account..."
              : "Create Student Account"}
          </button>

        </form>

        {/* Login */}
        <p className="auth-switch">
          Already registered?{" "}
          <Link to="/login">
            Student Login
          </Link>
        </p>

      </div>
    </section>
  );
}