import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../services/api";
import "./Navbar.css";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [student, setStudent] = useState(null);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);

  const navigate = useNavigate();
  const dashboardRef = useRef(null);

  useEffect(() => {
    let isActive = true;

    authApi
      .me()
      .then(({ user }) => {
        if (isActive) {
          setStudent(user);
        }
      })
      .catch(() => {
        if (isActive) {
          setStudent(null);
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dashboardRef.current &&
        !dashboardRef.current.contains(event.target)
      ) {
        setIsDashboardOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsDashboardOpen(false);
  };

  const handleLogout = async () => {
    setIsDashboardOpen(false);

    try {
      await authApi.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setStudent(null);
      navigate("/login", {
        replace: true,
        state: {
          message: "You have been logged out.",
        },
      });
    }
  };

  return (
    <header className="navbar">
      <div className="navbar-content">

        {/* Logo */}
        <Link to="/" className="logo" onClick={closeMenu}>
          <img
            src="/gyanexia_logo.png"
            alt="Gyanexia Logo"
            className="logo-img"
          />

          <span className="logo-text">Gyanexia</span>
        </Link>

        {/* =========================
            DESKTOP NAVIGATION
        ========================= */}
        <nav className="desktop-nav">

          <Link to="/" className="nav-link">
            Home
          </Link>

          <Link to="/about" className="nav-link">
            About
          </Link>

          <Link to="/competitions" className="nav-link">
            Competitions
            <span className="new-badge">NEW</span>
          </Link>

          <Link to="/previous-results" className="nav-link">
            Results
          </Link>

          <Link to="/sponsors" className="nav-link">
            Sponsors
          </Link>

          <Link to="/contact" className="nav-link">
            Contact
          </Link>

          {/* =========================
              LOGGED IN
          ========================= */}
          {student ? (
            <div
              className="dashboard-dropdown"
              ref={dashboardRef}
            >
              <button
                type="button"
                className="dashboard-nav-btn"
                onClick={() =>
                  setIsDashboardOpen(!isDashboardOpen)
                }
              >
                Dashboard
                <span
                  className={`dashboard-arrow ${
                    isDashboardOpen ? "open" : ""
                  }`}
                >
                  ▼
                </span>
              </button>

              {isDashboardOpen && (
                <div className="dashboard-menu">

                  <Link
                    to="/student/dashboard"
                    onClick={() => setIsDashboardOpen(false)}
                  >
                    <span>👤</span>
                    My Profile
                  </Link>

                  <Link
                    to="/student/dashboard"
                    onClick={() => setIsDashboardOpen(false)}
                  >
                    <span>🏆</span>
                    My Competitions
                  </Link>

                  <Link
                    to="/student/dashboard"
                    onClick={() => setIsDashboardOpen(false)}
                  >
                    <span>📊</span>
                    My Results
                  </Link>

                  <Link
                    to="/student/dashboard"
                    onClick={() => setIsDashboardOpen(false)}
                  >
                    <span>📜</span>
                    Certificates
                  </Link>

                  <div className="dashboard-menu-divider"></div>

                  <button
                    type="button"
                    className="dropdown-logout"
                    onClick={handleLogout}
                  >
                    <span>↪</span>
                    Logout
                  </button>

                </div>
              )}
            </div>
          ) : (

            /* =========================
               LOGGED OUT
            ========================= */
            <Link to="/login" className="login-btn">
              Login
            </Link>
          )}

          {/* Support Us */}
          <Link to="/donate" className="donate-btn">
            Support Us ❤️
          </Link>

        </nav>

        {/* =========================
            MOBILE MENU BUTTON
        ========================= */}
        <button
          type="button"
          className="mobile-menu-btn"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {isMenuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* =========================
          MOBILE NAVIGATION
      ========================= */}
      <div className={`mobile-nav ${isMenuOpen ? "open" : ""}`}>
        <nav className="mobile-nav-links">

          <Link to="/" onClick={closeMenu}>
            Home
          </Link>

          <Link to="/about" onClick={closeMenu}>
            About
          </Link>

          <Link to="/competitions" onClick={closeMenu}>
            Competitions
            <span className="new-badge">NEW</span>
          </Link>

          <Link to="/previous-results" onClick={closeMenu}>
            Results
          </Link>

          <Link to="/sponsors" onClick={closeMenu}>
            Sponsors
          </Link>

          <Link to="/contact" onClick={closeMenu}>
            Contact
          </Link>

          {student ? (
            <>
              <div className="mobile-dashboard-title">
                Dashboard
              </div>

              <Link
                to="/student/dashboard"
                onClick={closeMenu}
              >
                👤 My Profile
              </Link>

              <Link
                to="/student/dashboard"
                onClick={closeMenu}
              >
                🏆 My Competitions
              </Link>

              <Link
                to="/student/dashboard"
                onClick={closeMenu}
              >
                📊 My Results
              </Link>

              <Link
                to="/student/dashboard"
                onClick={closeMenu}
              >
                📜 Certificates
              </Link>

              <button
                type="button"
                className="mobile-logout-btn"
                onClick={handleLogout}
              >
                ↪ Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              onClick={closeMenu}
              className="mobile-auth-link"
            >
              Login
            </Link>
          )}

          <Link
            to="/donate"
            onClick={closeMenu}
            className="mobile-donate-btn"
          >
            Support Us ❤️
          </Link>

        </nav>
      </div>
    </header>
  );
};

export default Navbar;