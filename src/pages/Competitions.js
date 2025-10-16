import React, { useState } from "react";
import "./Competitions.css";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Competitions() {
  const [showForm, setShowForm] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);
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
  const [docId, setDocId] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const docRef = await addDoc(collection(db, "registrations"), {
        ...formData,
        paymentStatus: "Pending",
        timestamp: new Date(),
      });
      setDocId(docRef.id);
      setFormSubmitted(true);
    } catch (error) {
      console.error("Error saving data:", error);
      alert("❌ Something went wrong! Try again.");
    }
  };

  const handlePayNow = () => {
    if (!docId) {
      alert("❌ Please submit the registration form first.");
      return;
    }

    const options = {
      key: "rzp_live_RRMSCudaaURitm",
      amount: 7000,
      currency: "INR",
      name: "Gyanotsav 2.0",
      description: "Registration Fee",
      handler: function (response) {
        navigate("/registration-success");
      },
      prefill: {
        name: formData.name,
        contact: formData.phone,
      },
      theme: { color: "#3399cc" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
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

  // 🔽 Sample paper links (you can replace with actual file URLs)
  const samplePapers = [
    { class: "5th", medium: "Hindi", link: "/sample-papers/Class5-Hindi.pdf" },
    { class: "5th", medium: "English", link: "/sample-papers/Class5-English.pdf" },
    { class: "6th", medium: "Hindi", link: "/sample-papers/Class6-Hindi.pdf" },
    { class: "6th", medium: "English", link: "/sample-papers/Class6-English.pdf" },
    { class: "7th", medium: "Hindi", link: "/sample-papers/Class7-Hindi.pdf" },
    { class: "7th", medium: "English", link: "/sample-papers/Class7-English.pdf" },
    { class: "8th", medium: "Hindi", link: "/sample-papers/Class8-Hindi.pdf" },
    { class: "8th", medium: "English", link: "/sample-papers/Class8-English.pdf" },
    { class: "9th", medium: "Hindi", link: "/sample-papers/Class9-Hindi.pdf" },
    { class: "9th", medium: "English", link: "/sample-papers/Class9-English.pdf" },
    { class: "10th", medium: "Hindi", link: "/sample-papers/Class10-Hindi.pdf" },
    { class: "10th", medium: "English", link: "/sample-papers/Class10-English.pdf" },
    { class: "11th", medium: "Hindi", link: "/sample-papers/Class11-Hindi.pdf" },
    { class: "11th", medium: "English", link: "/sample-papers/Class11-English.pdf" },
    { class: "12th", medium: "Hindi", link: "/sample-papers/Class12-Hindi.pdf" },
    { class: "12th", medium: "English", link: "/sample-papers/Class12-English.pdf" },
  ];

  return (
    <div className="upcoming-container">
      <h1 className="title">Upcoming Competitions</h1>

      {/* --- Gyanotsav Card --- */}
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

      {/* --- Sample Papers Card --- */}
      <div className="competition-card">
        <h2 className="competition-name">Sample Papers for Gyanotsav 2.0</h2>
        <p>Will be available soon!!</p>
        <button className="download-btn" onClick={() => setShowDownloadOptions(true)}>
           Download Sample Papers
        </button>
      </div>

      {/* --- New Syllabus Card --- */}
      <div className="competition-card syllabus-card">
        <h2 className="competition-name"> Syllabus – Gyanotsav 2.0</h2>
        <p><strong>Exam will be conducted according to your class syllabus— so prepare confidently!</strong></p>

        <p><strong>For Classes 5th to 10th:</strong></p>
        <ul>
          <li>Mathematics – Based on NCERT syllabus</li>
          <li>Science – Physics, Chemistry, and Biology from NCERT concepts.</li>
          <li>Reasoning – Questions to test your IQ and logic.</li>
          <li>Extra Subject – Hindi or English (Grammar based questions)</li>
        </ul>
        <hr />
        <p><strong>For Classes 11th and 12th:</strong></p>
        <ul>
          <li>Physics & Chemistry – Based on NCERT Syllabus</li>
          <li>Mathematics/Biology – As per chosen stream (Based on NCERT).</li>
          <li>Logical Reasoning – Analytical and aptitude-based questions.</li>
          <li>Extra Subject – Hindi or English (Grammar based questions)</li>
        </ul>
        <p><em>✨ Note: Syllabus aligns with NCERT pattern and focuses on conceptual understanding and reasoning ability.</em></p>
      </div>

      {/* --- Download Options Popup --- */}
      {showDownloadOptions && (
        <div className="form-overlay">
          <div className="download-popup">
            <h2>Select Class & Medium</h2>
            <div className="download-list">
              {samplePapers.map((paper, idx) => (
                <a
                  key={idx}
                  href={paper.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="download-option"
                >
                  Class {paper.class} ({paper.medium} Medium)
                </a>
              ))}
            </div>
            <button className="cancel-btn" onClick={() => setShowDownloadOptions(false)}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* --- Registration Form Popup --- */}
      {showForm && (
        <div className="form-overlay">
          <div className="form-container">
            <h2>Gyanotsav 2.0 Registration</h2>
            <h3>Registration fees: ₹70/-</h3>

            {!formSubmitted ? (
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Name:</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label>Father's Name:</label>
                    <input type="text" name="fatherName" value={formData.fatherName} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label>Phone Number:</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} pattern="[0-9]{10}" required />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Class:</label>
                    <select name="studentClass" value={formData.studentClass} onChange={handleChange} required>
                      <option value="">Select Class</option>
                      {[5,6,7,8,9,10,11,12].map((grade) => (
                        <option key={grade} value={grade}>{grade}</option>
                      ))}
                    </select>
                  </div>

                  {["11","12"].includes(formData.studentClass) && (
                    <div className="form-group">
                      <label>Stream:</label>
                      <select name="stream" value={formData.stream} onChange={handleChange} required>
                        <option value="">Select</option>
                        <option value="Maths">Maths</option>
                        <option value="Biology">Biology</option>
                      </select>
                    </div>
                  )}
                </div>

                <div className="form-row">
                  <div className="form-group" style={{ flex: "1 1 100%" }}>
                    <label>College / School / Coaching Name:</label>
                    <input type="text" name="collegeName" value={formData.collegeName} onChange={handleChange} required />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group" style={{ flex: "1 1 100%" }}>
                    <label>Address:</label>
                    <textarea name="address" value={formData.address} onChange={handleChange} required />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Medium:</label>
                    <select name="medium" value={formData.medium} onChange={handleChange} required>
                      <option value="">Select Medium</option>
                      <option value="Hindi">Hindi</option>
                      <option value="English">English</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Extra Subject:</label>
                    <select name="extraSubject" value={formData.extraSubject} onChange={handleChange} required>
                      <option value="">Select Subject</option>
                      <option value="Hindi">Hindi</option>
                      <option value="English">English</option>
                    </select>
                  </div>
                </div>

                <div className="subjects-box">
                  <p><strong>Your Subjects:</strong></p>
                  <ul>{getSubjects().map((subj, idx) => <li key={idx}>{subj}</li>)}</ul>
                </div>

                <div className="form-buttons">
                  <button type="submit" className="submit-btn">Submit</button>
                  <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
                </div>
              </form>
            ) : (
              <div className="payment-section">
                <h3>Proceed with payment to complete your registration!!</h3>
                <button className="pay-btn" onClick={handlePayNow}>Pay Now</button>
                <div className="form-buttons" style={{ marginTop: "20px" }}>
                  <button className="cancel-btn" onClick={() => setShowForm(false)}>Close</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
