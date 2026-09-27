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

import { queryApi } from "../services/api";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone" && !/^\d*$/.test(value)) {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSuccess("");
    setError("");

    if (formData.phone.length !== 10) {
      setError(
        "Please enter a valid 10-digit phone number."
      );
      return;
    }

    try {
      setLoading(true);

      await queryApi.create({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        message: formData.message.trim(),
      });

      setSuccess(
        "Your query has been submitted successfully. Our team will contact you soon."
      );

      setFormData({
        name: "",
        phone: "",
        address: "",
        message: "",
      });
    } catch (requestError) {
      console.error(
        "Query submission error:",
        requestError
      );

      setError(
        requestError.message ||
          "Unable to submit your query. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-container">

      <h1 className="contact-title">
        Contact Us
      </h1>

      <div className="contact-sections">

        {/* =========================================
            CONTACT DETAILS
        ========================================= */}

        <div className="contact-details">

          <h2>
            Get in Touch
          </h2>

          <div className="contact-item">
            <FaPhoneAlt />
            <span>
              +91 8840284749
            </span>
          </div>

          <div className="contact-item">
            <FaEnvelope />
            <span>
              gyanexia@gmail.com
            </span>
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


        {/* =========================================
            QUERY FORM
        ========================================= */}

        <div className="contact-form">

          <h2>
            Send Your Query
          </h2>

          {success && (
            <div className="query-success">
              ✓ {success}
            </div>
          )}

          {error && (
            <div className="query-error">
              ⚠ {error}
            </div>
          )}


          <form onSubmit={handleSubmit}>

            {/* NAME */}

            <div className="form-field">

              <div className="input-wrapper">

                <FaUser className="input-icon" />

                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>


            {/* PHONE */}

            <div className="form-field">

              <div className="input-wrapper">

                <FaPhoneAlt className="input-icon" />

                <input
                  type="text"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                  maxLength="10"
                  inputMode="numeric"
                  required
                />

              </div>

            </div>


            {/* ADDRESS */}

            <div className="form-field">

              <div className="input-wrapper">

                <FaMapMarkerAlt className="input-icon" />

                <input
                  type="text"
                  name="address"
                  placeholder="Address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>


            {/* MESSAGE */}

            <div className="form-field">

              <div className="input-wrapper textarea-wrapper">

                <FaCommentDots className="input-icon textarea-icon" />

                <textarea
                  name="message"
                  placeholder="Your Query / Message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>


            {/* SUBMIT */}

            <button
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Submitting..."
                : "Submit Query"}
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}