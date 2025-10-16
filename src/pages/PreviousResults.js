import React from "react";
import "./PreviousResults.css";

export default function PreviousResults() {
  const totalImages = 14; // Number of images in gallery (exam1.jpg, exam2.jpg, ...)

  // Gallery images
  const images = Array.from(
    { length: totalImages },
    (_, i) => `${process.env.PUBLIC_URL}/exam${i + 1}.jpg`
  );

  // Winner images with name & school
  const winners = [
    {
      title: "🥇 1st Winner",
      name: "Himanshu",
      school: "NATIONAL PRATHAM ACADEMY, JB GANJ KHERI",
      img: `${process.env.PUBLIC_URL}/Winner1.jpg`,
    },
    {
      title: "🥈 2nd Winner", 
      name: "Abhishek Saxena",
      school: "VIBHU STUDY POINT, DELPANDARWA (HARDOI)",
      img: `${process.env.PUBLIC_URL}/Winner2.jpg`,
    },
    {
      title: "🥉 3rd Winner",
      name: "Pranshu",
      school: "RD PUBLIC SCHOOL, JB GANJ KHERI",
      img: `${process.env.PUBLIC_URL}/Winner3.jpg`,
    },
  ];

  return (
    <div className="results-container">
      <h1 className="results-title">Previous Results</h1>
      <h2 className="results-subtitle">Gyanotsav Competition - 2025</h2>

      {/* --- Winners Section --- */}
      <div className="winners-section">
        {winners.map((winner, index) => (
          <div key={index} className="winner-card">
            <img
              src={winner.img}
              alt={winner.title}
              className="winner-img"
            />
            <h3 className="winner-title">{winner.title}</h3>
            <p className="winner-name"><strong>{winner.name}</strong></p>
            <p className="winner-school">{winner.school}</p>
          </div>
        ))}
      </div>

      {/* --- Gallery Section --- */}
      <h2 className="gallery-title">Gallery</h2>
      <div className="results-grid">
        {images.map((src, idx) => (
          <div key={idx} className="result-card">
            <img src={src} alt={`Result ${idx + 1}`} className="result-img" />
          </div>
        ))}
      </div>
    </div>
  );
}
