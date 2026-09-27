import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { authApi } from "../services/api";
import "./Auth.css";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [loginType, setLoginType] = useState("student");

  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const successMessage = location.state?.message;

  const handleLogin = async (event) => {
    event.preventDefault();

    setError("");

    const mobile = mobileNumber.trim();

    if (!/^[6-9]\d{9}$/.test(mobile)) {
      setError("Enter a valid 10-digit Indian mobile number.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setLoading(true);

      const result = await authApi.login({
        mobileNumber: mobile,
        password,
      });

      const user = result?.user;

      if (!user) {
        throw new Error(
          "Login successful, but user information was not returned."
        );
      }

      /* ==========================================
         ADMIN LOGIN
      ========================================== */

      if (loginType === "admin") {
        if (
          user.role !== "admin" &&
          user.role !== "superadmin"
        ) {
          await authApi.logout();

          setError(
            "This account does not have administrator access."
          );

          return;
        }

        navigate("/admin/dashboard", {
          replace: true,
        });

        return;
      }

      /* ==========================================
         STUDENT LOGIN
      ========================================== */

      if (user.role !== "student") {
        await authApi.logout();

        setError(
          "This is an administrator account. Please use Admin Login."
        );

        return;
      }

      navigate("/student/dashboard", {
        replace: true,
      });

    } catch (loginError) {
      console.error("Login error:", loginError);

      setError(
        loginError?.message ||
          "Invalid mobile number or password."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLoginTypeChange = (type) => {
    setLoginType(type);

    setError("");

    setMobileNumber("");
    setPassword("");
  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        {/* ==========================================
            HEADER
        ========================================== */}

        <div className="auth-header">

          <p className="auth-eyebrow">
            GYANEXIA{" "}
            {loginType === "admin"
              ? "ADMIN PORTAL"
              : "STUDENT PORTAL"}
          </p>

          <h1>Welcome back</h1>

          <p>
            {loginType === "admin"
              ? "Sign in to manage the Gyanexia platform."
              : "Sign in to keep learning, competing and growing."}
          </p>

        </div>


        {/* ==========================================
            LOGIN TYPE TABS
        ========================================== */}

        <div className="login-type-tabs">

          <button
            type="button"
            className={`login-type-btn ${
              loginType === "student"
                ? "active"
                : ""
            }`}
            onClick={() =>
              handleLoginTypeChange("student")
            }
            disabled={loading}
          >
            Student Login
          </button>

          <button
            type="button"
            className={`login-type-btn ${
              loginType === "admin"
                ? "active"
                : ""
            }`}
            onClick={() =>
              handleLoginTypeChange("admin")
            }
            disabled={loading}
          >
            Admin Login
          </button>

        </div>


        {/* ==========================================
            SUCCESS MESSAGE
        ========================================== */}

        {successMessage && !error && (
          <div className="auth-success">
            {successMessage}
          </div>
        )}


        {/* ==========================================
            ERROR MESSAGE
        ========================================== */}

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}


        {/* ==========================================
            LOGIN FORM
        ========================================== */}

        <form
          className="auth-form"
          onSubmit={handleLogin}
        >

          {/* Mobile Number */}

          <div className="form-group">

            <input
              id="mobileNumber"
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              maxLength={10}
              value={mobileNumber}
              onChange={(event) =>
                setMobileNumber(
                  event.target.value.replace(/\D/g, "")
                )
              }
              placeholder="Mobile Number"
              aria-label="Mobile Number"
              disabled={loading}
            />

          </div>


          {/* Password */}

          <div className="form-group">

            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              placeholder="Password"
              aria-label="Password"
              disabled={loading}
            />

          </div>


          {/* Submit */}

          <button
            type="submit"
            className="auth-submit-btn"
            disabled={loading}
          >
            {loading
              ? "Signing in..."
              : loginType === "admin"
              ? "Admin Login"
              : "Student Login"}
          </button>

        </form>


        {/* ==========================================
            STUDENT REGISTRATION
        ========================================== */}

        {loginType === "student" && (
          <p className="auth-footer">

            New Student?{" "}

            <button
              type="button"
              className="auth-link-button"
              onClick={() =>
                navigate("/student/register")
              }
              disabled={loading}
            >
              Create Account
            </button>

          </p>
        )}


        {/* ==========================================
            ADMIN INFORMATION
        ========================================== */}

        {loginType === "admin" && (
          <p className="admin-login-note">
            Administrator accounts are created by
            authorized Gyanexia administrators only.
          </p>
        )}

      </div>

    </div>
  );
};

export default Login;