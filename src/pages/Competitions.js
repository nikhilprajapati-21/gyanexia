import React, { useState } from "react";
import "./Competitions.css";
import { db } from "../firebase"; // Firestore instance
import { collection, addDoc } from "firebase/firestore";

export default function Competitions() {
  const [showForm, setShowForm] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [receipt, setReceipt] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    fatherName: "",
    phone: "",
    studentClass: "",
    stream: "",
    collegeName: "",
    address: "",
    medium: "",
    extraSubject: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "registrations"), {
        ...formData,
        paymentStatus: "Pending",
        timestamp: new Date(),
      });
      setFormSubmitted(true);
    } catch (error) {
      console.error("Error saving data:", error);
      alert("❌ Something went wrong! Try again.");
    }
  };

  const handleReceiptUpload = (e) => {
    const file = e.target.files[0];
    if (file) setReceipt(file);
  };

  const handleConfirmPayment = () => {
    if (!receipt) {
      alert("⚠️ Please upload your payment receipt before confirming!");
      return;
    }

    alert("✅ Your registration has been submitted successfully!\nYou will receive a confirmation once our team verifies your details.");


    // Reset UI
    setShowForm(false);
    setFormSubmitted(false);
    setShowQR(false);
    setReceipt(null);
  };

  const getSubjects = () => {
    const { studentClass, stream, extraSubject } = formData;
    let subjects = [];
    if (["11", "12"].includes(studentClass)) {
      subjects = ["Science (Physics + Chemistry)", "Logical Questions"];
      if (stream) subjects.push(stream);
    } else {
      subjects = ["Maths", "Science", "Logical Questions"];
    }
    if (extraSubject) subjects.push(extraSubject);
    return subjects;
  };

  return (
    <div className="upcoming-container">
      <h1 className="title">Upcoming Competitions</h1>

      <div className="competition-card">
        <h2 className="competition-name">Gyanotsav 2.0</h2>
        <p>
          <strong>Eligibility:</strong> Grade 5th to 12th
        </p>
        <p>
          <strong>Exam Date:</strong> 14 December 2025
        </p>
        <p>
          <strong>Exam Mode:</strong> Offline
        </p>
        <p>
          <strong>Medium:</strong> Both Hindi and English
        </p>
        <p>
          <strong>Subjects:</strong> Maths + Science + Reasoning + Hindi/English
        </p>
        <p className="registration-text">
          <strong>🎉 Registration is open – Enroll Now!! 🎯</strong>
          <h2>23% Off!!</h2>
        </p>
        <button className="register-btn" onClick={() => setShowForm(true)}>
          Register Now
        </button>
      </div>

      <div className="competition-card">
        <h2 className="competition-name">Sample Papers for Gyanotsav 2.0</h2>
        <p>Will be available soon!!</p>
        <a
          href="/sample-papers.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="download-btn"
        >
          Download Sample Papers (PDF)
        </a>
      </div>

      {showForm && (
        <div className="form-overlay">
          <div className="form-container">
            <h2>Gyanotsav 2.0 Registration</h2>
            <h3>Registration fees: ₹70/-</h3>

            {!formSubmitted ? (
              <form onSubmit={handleSubmit}>
                {/* Row 1: Name + Father's Name + Phone */}
                <div className="form-row">
                  <div className="form-group">
                    <label>Name:</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Father's Name:</label>
                    <input
                      type="text"
                      name="fatherName"
                      value={formData.fatherName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone Number:</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                      pattern="[0-9]{10}"
                      required
                    />
                  </div>
                </div>

                {/* Row 2: Class + Stream */}
                <div className="form-row">
                  <div className="form-group">
                    <label>Class:</label>
                    <select
                      name="studentClass"
                      value={formData.studentClass}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Class</option>
                      {[5, 6, 7, 8, 9, 10, 11, 12].map((grade) => (
                        <option key={grade} value={grade}>
                          {grade}
                        </option>
                      ))}
                    </select>
                  </div>

                  {["11", "12"].includes(formData.studentClass) && (
                    <div className="form-group">
                      <label>Stream:</label>
                      <select
                        name="stream"
                        value={formData.stream}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select</option>
                        <option value="Maths">Maths</option>
                        <option value="Biology">Biology</option>
                      </select>
                    </div>
                  )}
                </div>

                {/* College/School/Coaching Name */}
                <div className="form-row">
                  <div className="form-group" style={{ flex: "1 1 100%" }}>
                    <label>College / School / Coaching Name:</label>
                    <input
                      type="text"
                      name="collegeName"
                      value={formData.collegeName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="form-row">
                  <div className="form-group" style={{ flex: "1 1 100%" }}>
                    <label>Address:</label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Medium + Extra Subject */}
                <div className="form-row">
                  <div className="form-group">
                    <label>Medium:</label>
                    <select
                      name="medium"
                      value={formData.medium}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Medium</option>
                      <option value="Hindi">Hindi</option>
                      <option value="English">English</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Extra Subject:</label>
                    <select
                      name="extraSubject"
                      value={formData.extraSubject}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Subject</option>
                      <option value="Hindi">Hindi</option>
                      <option value="English">English</option>
                    </select>
                  </div>
                </div>

                {/* Subjects Preview */}
                <div className="subjects-box">
                  <p>
                    <strong>Your Subjects:</strong>
                  </p>
                  <ul>
                    {getSubjects().map((subj, idx) => (
                      <li key={idx}>{subj}</li>
                    ))}
                  </ul>
                </div>

                {/* Buttons */}
                <div className="form-buttons">
                  <button type="submit" className="submit-btn">
                    Submit
                  </button>
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="payment-section">
                <h3>Please proceed with payment to complete your registration.</h3>
                
                <button className="pay-btn" onClick={() => setShowQR(true)}>
                  Pay Now
                </button>

                {showQR && (
                  <div className="qr-overlay">
                    <div className="qr-container">
                      <h3>Scan & Pay</h3>
                      <img src="/qr.jpg" alt="QR Code" className="qr-image" />
                      <div className="upload-box">
                        <label>Upload Payment Receipt:</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleReceiptUpload}
                        />
                        {receipt && (
                          <p className="file-name">📂 {receipt.name}</p>
                        )}
                      </div>
                      <div className="qr-buttons">
                        <button
                          className="confirm-btn"
                          onClick={handleConfirmPayment}
                        >
                          Confirm Payment
                        </button>
                        <button
                          className="cancel-btn"
                          onClick={() => setShowQR(false)}
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
