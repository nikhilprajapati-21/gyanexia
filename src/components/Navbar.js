import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="navbar-content">
        
        {/* Logo */}
        <div className="logo">
          <img
            src="/gyanexia_logo.png"
            alt="Gyanexia Logo"
            className="logo-img"
          />
          <span className="logo-text">Gyanexia</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          <Link to="/" className="nav-link">Home</Link>

          <Link to="/about" className="nav-link">About</Link>

          <Link to="/previous-results" className="nav-link">
            Previous Results
          </Link>

          <Link to="/competitions" className="nav-link">
            Competitions <span className="new-badge">NEW</span>
          </Link>

          <Link to="/sponsors" className="nav-link">Sponsors</Link>

          <Link to="/contact" className="nav-link">Contact Us</Link>

          {/* 🔥 Donate Button */}
          <Link to="/donate" className="donate-btn">
  Support Us ❤️
</Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="mobile-menu-btn"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Navigation */}
      <div className={`mobile-nav ${isMenuOpen ? "open" : ""}`}>
        <nav className="mobile-nav-links">

          <Link to="/" onClick={() => setIsMenuOpen(false)}>
            Home
          </Link>

          <Link to="/about" onClick={() => setIsMenuOpen(false)}>
            About
          </Link>

          <Link to="/previous-results" onClick={() => setIsMenuOpen(false)}>
            Previous Results
          </Link>

          <Link to="/competitions" onClick={() => setIsMenuOpen(false)}>
            Competitions <span className="new-badge">NEW</span>
          </Link>

          <Link to="/sponsors" onClick={() => setIsMenuOpen(false)}>
            Sponsors
          </Link>

          <Link to="/contact" onClick={() => setIsMenuOpen(false)}>
            Contact Us
          </Link>

          {/* 🔥 Mobile Donate Button */}
          <Link
  to="/donate"
  onClick={() => setIsMenuOpen(false)}
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