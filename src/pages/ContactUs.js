import React, { useState } from "react";
import "./ContactUs.css";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaInstagram,
  FaWhatsapp,
  FaUser,
  FaMapMarkerAlt,
  FaCommentDots,
} from "react-icons/fa";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // allow only numbers in phone
    if (name === "phone" && !/^\d*$/.test(value)) return;

    setFormData({ ...formData, [name]: value });
  };

  // ✅ UPDATED: Send query to WhatsApp
  const handleSubmit = (e) => {
    e.preventDefault();

    // optional: simple phone validation
    if (formData.phone.length !== 10) {
      alert("Please enter a valid 10-digit phone number");
      return;
    }

    const message = `
New Query from Gyanexia Website 👇

👤 Name: ${formData.name}
📞 Phone: ${formData.phone}
📍 Address: ${formData.address}
💬 Message: ${formData.message}
    `;

    const whatsappURL = `https://wa.me/918840284749?text=${encodeURIComponent(
      message
    )}`;

    window.open(whatsappURL, "_blank");

    // clear form after opening WhatsApp
    setFormData({
      name: "",
      phone: "",
      address: "",
      message: "",
    });
  };

  return (
    <div className="contact-container">
      <h1 className="contact-title">Contact Us</h1>

      <div className="contact-sections">
        {/* ===== Contact Details Div ===== */}
        <div className="contact-details">
          <h2>Get in Touch</h2>

          <div className="contact-item">
            <FaPhoneAlt />
            <span>+91 8840284749</span>
          </div>

          <div className="contact-item">
            <FaEnvelope />
            <span>gyanexia@gmail.com</span>
          </div>

          <div className="contact-item">
            <FaWhatsapp className="whatsapp" />
            <a
              href="https://wa.me/918840284749"
              target="_blank"
              rel="noopener noreferrer"
            >
              Chat on WhatsApp
            </a>
          </div>

          <div className="contact-item">
            <FaInstagram className="instagram" />
            <a
              href="https://www.instagram.com/gyanexia_edu/"
              target="_blank"
              rel="noopener noreferrer"
            >
              @gyanexia_edu
            </a>
          </div>
        </div>

        {/* ===== Query Form Div ===== */}
        <div className="contact-form">
          <h2>Send Your Query</h2>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <FaUser />
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <FaPhoneAlt />
              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                maxLength="10"
                required
              />
            </div>

            <div className="form-group">
              <FaMapMarkerAlt />
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group textarea">
              <FaCommentDots />
              <textarea
                name="message"
                placeholder="Your Query / Message"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            {/* UX clarity */}
            <button type="submit">Send</button>
          </form>
        </div>
      </div>
    </div>
  );
}
