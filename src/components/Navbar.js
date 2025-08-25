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
          <img src="/gyanexia_logo.png" alt="Gyanexia Logo" className="logo-img" />
          <span className="logo-text">Gyanexia</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/about" className="nav-link">About</Link>
          <Link to="/previous-results" className="nav-link">Previous Results</Link>
          <Link to="/competitions" className="nav-link">
            Competitions <span className="new-badge">NEW</span>
          </Link>
          <Link to="/contact" className="nav-link">Contact Us</Link>
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
      {isMenuOpen && (
        <div className="mobile-nav">
          <nav className="mobile-nav-links">
            <Link to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link to="/about" className="nav-link" onClick={() => setIsMenuOpen(false)}>About</Link>
            <Link to="/previous-results" className="nav-link" onClick={() => setIsMenuOpen(false)}>Previous Results</Link>
            <Link to="/competitions" className="nav-link" onClick={() => setIsMenuOpen(false)}>
              Competitions <span className="new-badge">NEW</span>
            </Link>
            <Link to="/contact" className="nav-link" onClick={() => setIsMenuOpen(false)}>Contact Us</Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
