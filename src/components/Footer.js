// src/components/Footer.js
import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-grid">
          {/* Company Info */}
          <div className="footer-company">
            <div className="footer-logo">
              <span className="footer-logo-icon"></span>
              <span className="footer-logo-text">Gyanexia</span>
            </div>
            <p className="footer-description">
              Empowering minds through knowledge and innovation. Your journey to excellence starts here.
            </p>
            <div className="social-links">
              <div className="social-icon">💼</div>
              <div className="social-icon">✉️</div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-links">
            <h3 className="footer-heading">Quick Links</h3>
            <ul className="footer-list">
              <li><Link to="/" className="footer-link">Home</Link></li>
              <li><Link to="/about" className="footer-link">About</Link></li>
              <li><Link to="/competitions" className="footer-link">Competitions</Link></li>
              <li><Link to="/terms" className="footer-link">Terms & Conditions</Link></li>
              <li><Link to="/privacy" className="footer-link">Privacy Policy</Link></li>
              <li><Link to="/refund" className="footer-link">Refund Policy</Link></li>
              <li><Link to="/disclaimer" className="footer-link">Disclaimer</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-contact">
            <h3 className="footer-heading">Contact</h3>
            <ul className="footer-list">
              <li className="footer-contact-item">
                <span className="footer-contact-icon">📞</span>
                <span>+91 8840284749</span>
              </li>
              <li className="footer-contact-item">
                <span className="footer-contact-icon">✉️</span>
                <span>gyanexia@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            &copy; {new Date().getFullYear()} Gyanexia. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
