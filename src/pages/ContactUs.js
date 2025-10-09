import React from "react";
import "./ContactUs.css";
import { FaPhoneAlt, FaEnvelope, FaInstagram, FaWhatsapp } from "react-icons/fa";

export default function ContactUs() {
  return (
    <div className="contact-container">
      <h1 className="contact-title">Contact Us</h1>
      <p className="contact-subtitle">
        Have questions or need help? Feel free to reach out to us through any of the options below.
      </p>

      <div className="contact-card">
        {/* 📞 Phone */}
        <div className="contact-item">
          <FaPhoneAlt className="contact-icon" />
          <span className="contact-text">+91 8840284749</span>
        </div>

        {/* ✉️ Email */}
        <div className="contact-item">
          <FaEnvelope className="contact-icon" />
          <span className="contact-text">prajapati09297@gmail.com</span>
        </div>

        {/* 💬 WhatsApp */}
        <div className="contact-item">
          <FaWhatsapp className="contact-icon" style={{ color: "#25D366" }} />
          <a
            href="https://wa.me/918840284749?text=Hi%2C%20I%27m%20interested%20in%20Gyanotsav%202.0%20registration."
            target="_blank"
            rel="noopener noreferrer"
            className="contact-link"
          >
            Chat on WhatsApp
          </a>
        </div>

        {/* 📸 Instagram */}
        <div className="contact-item">
          <FaInstagram className="contact-icon" style={{ color: "#E1306C" }} />
          <a
            href="https://www.instagram.com/gyanexia_edu/"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-link"
          >
            @gyanexia_edu
          </a>
        </div>
      </div>
    </div>
  );
}
