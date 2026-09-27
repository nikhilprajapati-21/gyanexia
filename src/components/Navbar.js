import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { authApi } from "../services/api";
import "./Navbar.css";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [student, setStudent] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const dashboardRef = useRef(null);

  // ==========================================
  // CHECK LOGIN STATUS
  // ==========================================

  useEffect(() => {
    let isActive = true;

    const checkAuthentication = async () => {
      try {
        const { user } = await authApi.me();

        if (isActive) {
          setStudent(user);
        }
      } catch (error) {
        if (isActive) {
          setStudent(null);
        }
      } finally {
        if (isActive) {
          setIsCheckingAuth(false);
        }
      }
    };

    checkAuthentication();

    return () => {
      isActive = false;
    };
  }, [location.pathname]);

  // ==========================================
  // CLOSE DROPDOWN WHEN CLICKING OUTSIDE
  // ==========================================

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dashboardRef.current &&
        !dashboardRef.current.contains(event.target)
      ) {
        setIsDashboardOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  // ==========================================
  // CLOSE MOBILE MENU
  // ==========================================

  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsDashboardOpen(false);
  };

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = async () => {
    setIsDashboardOpen(false);
    setIsMenuOpen(false);

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

  // ==========================================
  // CHECK USER ROLE
  // ==========================================

  const isStudent = student?.role === "student";

  const isAdmin =
    student?.role === "admin" ||
    student?.role === "superadmin";

  return (
    <header className="navbar">

      <div className="navbar-content">

        {/* ======================================
            LOGO
        ====================================== */}

        <Link
          to="/"
          className="logo"
          onClick={closeMenu}
        >
          <img
            src="/gyanexia_logo.png"
            alt="Gyanexia Logo"
            className="logo-img"
          />

          <span className="logo-text">
            Gyanexia
          </span>
        </Link>


        {/* ======================================
            CENTER NAVIGATION
        ====================================== */}

        <nav className="desktop-nav">

          <Link
            to="/"
            className="nav-link"
          >
            Home
          </Link>

          <Link
            to="/about"
            className="nav-link"
          >
            About
          </Link>

          <Link
            to="/competitions"
            className="nav-link"
          >
            Competitions

            <span className="new-badge">
              NEW
            </span>
          </Link>

          <Link
            to="/previous-results"
            className="nav-link"
          >
            Results
          </Link>

          <Link
            to="/sponsors"
            className="nav-link"
          >
            Sponsors
          </Link>

          <Link
            to="/contact"
            className="nav-link"
          >
            Contact
          </Link>

        </nav>


        {/* ======================================
            RIGHT SIDE ACTIONS
        ====================================== */}

        <div className="navbar-actions">

          {!isCheckingAuth && (

            <>

              {/* =================================
                  STUDENT DASHBOARD
              ================================= */}

              {isStudent && (

                <div
                  className="dashboard-dropdown"
                  ref={dashboardRef}
                >

                  <button
                    type="button"
                    className="dashboard-nav-btn"
                    onClick={() =>
                      setIsDashboardOpen(
                        (previous) => !previous
                      )
                    }
                  >
                    Dashboard

                    <span
                      className={`dashboard-arrow ${
                        isDashboardOpen
                          ? "open"
                          : ""
                      }`}
                    >
                      ▼
                    </span>
                  </button>


                  {isDashboardOpen && (

                    <div className="dashboard-menu">

                      <Link
                        to="/student/dashboard"
                        onClick={() =>
                          setIsDashboardOpen(false)
                        }
                      >
                        <span>👤</span>
                        My Profile
                      </Link>


                      <Link
                        to="/student/dashboard"
                        onClick={() =>
                          setIsDashboardOpen(false)
                        }
                      >
                        <span>🏆</span>
                        My Competitions
                      </Link>


                      <Link
                        to="/student/dashboard"
                        onClick={() =>
                          setIsDashboardOpen(false)
                        }
                      >
                        <span>📊</span>
                        My Results
                      </Link>


                      <Link
                        to="/student/dashboard"
                        onClick={() =>
                          setIsDashboardOpen(false)
                        }
                      >
                        <span>📜</span>
                        Certificates
                      </Link>


                      <div className="dashboard-menu-divider" />


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

              )}


              {/* =================================
                  ADMIN / SUPER ADMIN DASHBOARD
              ================================= */}

              {isAdmin && (

                <div
                  className="dashboard-dropdown"
                  ref={dashboardRef}
                >

                  <button
                    type="button"
                    className="dashboard-nav-btn"
                    onClick={() =>
                      setIsDashboardOpen(
                        (previous) => !previous
                      )
                    }
                  >
                    Admin Dashboard

                    <span
                      className={`dashboard-arrow ${
                        isDashboardOpen
                          ? "open"
                          : ""
                      }`}
                    >
                      ▼
                    </span>
                  </button>


                  {isDashboardOpen && (

                    <div className="dashboard-menu">

                      <Link
                        to="/admin/dashboard"
                        onClick={() =>
                          setIsDashboardOpen(false)
                        }
                      >
                        <span>🛠️</span>
                        Admin Dashboard
                      </Link>


                      <div className="dashboard-menu-divider" />


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

              )}


              {/* =================================
                  LOGGED OUT
              ================================= */}

              {!student && (

                <Link
                  to="/login"
                  className="login-btn"
                >
                  Login
                </Link>

              )}

            </>

          )}


          {/* ======================================
              SUPPORT US
          ====================================== */}

          <Link
            to="/donate"
            className="donate-btn"
          >
            Support Us ❤️
          </Link>

        </div>


        {/* ======================================
            MOBILE MENU BUTTON
        ====================================== */}

        <button
          type="button"
          className="mobile-menu-btn"
          onClick={() =>
            setIsMenuOpen(
              (previous) => !previous
            )
          }
          aria-label="Toggle navigation menu"
        >
          {isMenuOpen ? "✕" : "☰"}
        </button>

      </div>


      {/* ========================================
          MOBILE NAVIGATION
      ======================================== */}

      <div
        className={`mobile-nav ${
          isMenuOpen ? "open" : ""
        }`}
      >

        <nav className="mobile-nav-links">

          <Link
            to="/"
            onClick={closeMenu}
          >
            Home
          </Link>


          <Link
            to="/about"
            onClick={closeMenu}
          >
            About
          </Link>


          <Link
            to="/competitions"
            onClick={closeMenu}
          >
            Competitions

            <span className="new-badge">
              NEW
            </span>
          </Link>


          <Link
            to="/previous-results"
            onClick={closeMenu}
          >
            Results
          </Link>


          <Link
            to="/sponsors"
            onClick={closeMenu}
          >
            Sponsors
          </Link>


          <Link
            to="/contact"
            onClick={closeMenu}
          >
            Contact
          </Link>


          {/* ==================================
              MOBILE AUTHENTICATION
          ================================== */}

          {!isCheckingAuth && (

            <>

              {/* =================================
                  STUDENT
              ================================= */}

              {isStudent && (

                <>

                  <div className="mobile-dashboard-title">
                    Dashboard
                  </div>


                  <Link
                    to="/student/dashboard"
                    onClick={closeMenu}
                    className="mobile-dashboard-link"
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

              )}


              {/* =================================
                  ADMIN / SUPER ADMIN
              ================================= */}

              {isAdmin && (

                <>

                  <div className="mobile-dashboard-title">
                    Administration
                  </div>


                  <Link
                    to="/admin/dashboard"
                    onClick={closeMenu}
                  >
                    🛠️ Admin Dashboard
                  </Link>


                  <button
                    type="button"
                    className="mobile-logout-btn"
                    onClick={handleLogout}
                  >
                    ↪ Logout
                  </button>

                </>

              )}


              {/* =================================
                  LOGGED OUT
              ================================= */}

              {!student && (

                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="mobile-auth-link"
                >
                  Login
                </Link>

              )}

            </>

          )}


          {/* ==================================
              MOBILE SUPPORT US
          ================================== */}

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