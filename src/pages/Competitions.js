import React, { useState } from "react";
import "./Competitions.css";

export default function Competitions() {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked(true);
  };

  return (
    <div className="competition-container">
      <div className="competition-card">
        <h1 className="competition-title">🏆 Gyanexia Talent Hunt</h1>

        <p className="competition-tagline">
          Discover the Best Young Minds!
        </p>

        <div className="competition-details">
          <p>🎯 Classes: 5th – 12th</p>
          <p>📍 Mode: Offline</p>
          <p>📅 Exam Date: <strong>Coming Soon</strong></p>
        <p>🏅 Prize details will be announced soon.</p>
        </div>

        <p className="competition-extra">
          👉 Subjects and topics will be notified soon. Stay tuned for updates! 📚✨
        </p>

        <button 
          className={`notify-btn ${clicked ? "clicked" : ""}`} 
          onClick={handleClick}
        >
          {clicked ? "You'll be notified! ✅" : "Get Notified"}
        </button>
      </div>
    </div>
  );
}