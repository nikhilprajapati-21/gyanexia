import React, { useState } from "react";
import "./Competitions.css";
import { db } from "../firebase"; // ✅ Firestore instance
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";

export default function UpcomingCompetitions() {
  const [showForm, setShowForm] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    fatherName: "",
    studentClass: "",
    stream: "",
    address: "",
    medium: "",
    extraSubject: "",
  });

  const [docId, setDocId] = useState(null); // 🔹 Store Firestore doc ID

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 🔹 Save registration to Firestore
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const docRef = await addDoc(collection(db, "registrations"), {
        ...formData,
        paymentStatus: "Pending",
        timestamp: new Date(),
      });
      setDocId(docRef.id);
      console.log("Form Submitted & Saved:", formData);
      setFormSubmitted(true);
    } catch (error) {
      console.error("Error saving data:", error);
      alert("❌ Something went wrong! Try again.");
    }
  };

  // 🔹 Update payment status
  const handlePayNow = async () => {
    alert("Redirecting to payment gateway...");
    window.open("https://pay.google.com", "_blank");

    if (docId) {
      try {
        await updateDoc(doc(db, "registrations", docId), {
          paymentStatus: "Paid",
        });
        console.log("✅ Payment status updated for:", docId);
      } catch (error) {
        console.error("Error updating payment status:", error);
      }
    }

    setShowForm(false);
    setFormSubmitted(false);
  };

  // 🔹 Function to get subjects list dynamically
  const getSubjects = () => {
    const { studentClass, stream, extraSubject } = formData;
    let subjects = [];

    if (["11", "12"].includes(studentClass)) {
      // Fixed for class 11 & 12
      subjects = ["Science (Physics + Chemistry)", "Logical Questions"];
      if (stream) {
        subjects.push(stream); // Maths or Biology
      }
    } else {
      // For class 5–10
      subjects = ["Maths", "Science", "Logical Questions"];
    }

    if (extraSubject) {
      subjects.push(extraSubject);
    }

    return subjects;
  };

  return (
    <div className="upcoming-container">
      <h1 className="title">Upcoming Competitions</h1>

      {/* Competition Card */}
      <div className="competition-card">
        <h2 className="competition-name">Gyanotsav 2.0</h2>
        <p><strong>Eligibility:</strong> Grade 5th to 12th</p>
        <p><strong>Exam Date:</strong> 14 December 2025</p>
        <p><strong>Exam Mode:</strong> Offline</p>
        <p><strong>Medium:</strong> Both Hindi and English (As per your choice)</p>
        <p><strong>Subjects:</strong> Maths + Science + Reasoning + Hindi/English</p>
        <p className="registration-text">
          <strong>🎉 Registration is open – Enroll Now!! 🎯</strong>
          <h2>23% Off!!</h2>
        </p>

        <button className="register-btn" onClick={() => setShowForm(true)}>
          Register Now
        </button>
      </div>

      {/* Sample Papers Card */}
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
                  <p><strong>Your Subjects:</strong></p>
                  <ul>
                    {getSubjects().map((subj, idx) => (
                      <li key={idx}>{subj}</li>
                    ))}
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
