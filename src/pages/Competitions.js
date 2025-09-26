import React, { useState } from "react";
import "./Competitions.css";

export default function UpcomingCompetitions() {
  const [showForm, setShowForm] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false); // ✅ track if submitted
  const [formData, setFormData] = useState({
    name: "",
    fatherName: "",
    studentClass: "",
    stream: "",
    address: "",
    medium: "",
    extraSubject: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
    setFormSubmitted(true); // ✅ show payment option instead of closing
  };

  // ✅ Handle Pay Now
  const handlePayNow = () => {
    alert("Redirecting to payment gateway...");
    window.open("https://pay.google.com", "_blank"); // Example placeholder
    setShowForm(false); // Close modal after payment
    setFormSubmitted(false);
  };

  return (
    <div className="upcoming-container">
      <h1 className="title">Upcoming Competitions</h1>

      {/* Competition Card */}
      <div className="competition-card">
        <h2 className="competition-name">Gyanotsav 2.0</h2>
        <p><strong>Eligibility:</strong> Grade 5th to 12th</p>
        <p><strong>Exam Date:</strong> 14 December 2025</p>
        <p><strong>Mode:</strong> Offline</p>
        <p><strong>Subjects:</strong> Maths + Science + Reasoning + Hindi/English</p>
        <p className="registration-text">
          <strong>Registration will start from 1st October</strong>
        </p>

        <button className="register-btn" onClick={() => setShowForm(true)}>
          Register Now
        </button>
      </div>

      {/* Sample Papers Card */}
      <div className="competition-card">
        <h2 className="competition-name">Sample Papers for Gyanotsav 2.0</h2>
        <p>Practice these given sample papers.</p>
        <a
          href="/sample-papers.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="download-btn"
        >
          Download Sample Papers (PDF)
        </a>
      </div>

      {/* Registration Form Modal */}
      {showForm && (
        <div className="form-overlay">
          <div className="form-container">
            <h2>Gyanotsav 2.0 Registration</h2>

            {!formSubmitted ? (
              <form onSubmit={handleSubmit}>
                {/* Row 1: Name + Father's Name */}
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
                </div>

                {/* Row 2: Class + Stream (if 11/12) */}
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
                      <label>Stream (Choose one):</label>
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

                {/* Row 3: Medium + Extra Subject */}
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
                    <label>Choose Extra Subject:</label>
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
                  <p><strong>Subjects:</strong></p>
                  <ul>
                    <li>Maths</li>
                    <li>Science</li>
                    <li>Logical Questions</li>
                    {formData.extraSubject && <li>{formData.extraSubject}</li>}
                    {["11", "12"].includes(formData.studentClass) && formData.stream && (
                      <li>{formData.stream}</li>
                    )}
                  </ul>
                </div>

                {/* Buttons */}
                <div className="form-buttons">
                  <button type="submit" className="submit-btn">Submit</button>
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
                <h3>✅ Registration Successful!</h3>
                <p>Please proceed with payment to complete your registration.</p>
                <button className="pay-btn" onClick={handlePayNow}>
                  Pay Now
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
