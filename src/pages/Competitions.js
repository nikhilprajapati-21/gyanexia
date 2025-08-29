import React from "react";
import "./Competitions.css";

export default function UpcomingCompetitions() {
  return (
    <div className="upcoming-container">
      <h1 className="title">Upcoming Competitions</h1>

      {/* Competition Card */}
      <div className="competition-card">
        <h2 className="competition-name">Gyanotsav 2.0</h2>

        <p><strong>Eligibility:</strong> Grade 5th to 12th</p>
        <p><strong>Exam Date:</strong> In December 2025</p>
        <p><strong>Mode:</strong> Offline</p>
        <p>
          <strong>Subjects:</strong> Maths + Science + Reasoning + Hindi/English
        </p>

        <p className="registration-text">
          <strong>Registration will start from 1st October</strong>
        </p>

        <button className="register-btn">Register Now</button>
      </div>

      {/* Sample Papers Card */}
      <div className="competition-card">
        <h2 className="competition-name">Sample Papers for Gyanotsav 2.0</h2>
        <p>
          Practice these given sample papers.
        </p>

        {/* Replace with your actual PDF file link */}
        <a
          href="/sample-papers.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="download-btn"
        >
           Download Sample Papers (PDF)
        </a>
      </div>
    </div>
  );
}
