import React from "react";
import "./ContactUs.css";   // ✅ Keep the CSS file as Contact.css

const ContactUs = () => {
  return (
    <div className="contact-container">
      <h1 className="contact-title">Contact Us</h1>
      <p className="contact-subtitle">
        We'd love to hear from you! Reach out to us through any of the following:
      </p>

      <div className="contact-card">
        <div className="contact-item">
          <span className="contact-icon">📞</span>
          <span className="contact-text">+91 8840284749</span>
        </div>

        <div className="contact-item">
          <span className="contact-icon">✉️</span>
          <span className="contact-text">prajapati09297@gmail.com</span>
        </div>

        <div className="contact-item">
          <span className="contact-icon">💼</span>
          <a
            href="https://www.linkedin.com/in/nikhil-prajapati-15bbab298?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-link"
          >
            Connect on LinkedIn
          </a>
        </div>

        <div className="contact-item">
          <span className="contact-icon">💬</span>
          <a
            href="https://wa.me/918840284749"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-link"
          >
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
