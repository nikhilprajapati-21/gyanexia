import React from "react";
import "./PreviousResults.css";

export default function PreviousResults() {
  // 🔹 Gyanotsav 2.0 Gallery
  const gyanotsav2GalleryCount = 11;
  const gyanotsav2Images = Array.from(
    { length: gyanotsav2GalleryCount },
    (_, i) => `${process.env.PUBLIC_URL}/G2_exam${i + 1}.jpeg`
  );

  // 🔹 Old Competition Gallery
  const totalImages = 14;
  const images = Array.from(
    { length: totalImages },
    (_, i) => `${process.env.PUBLIC_URL}/exam${i + 1}.jpg`
  );

  // 🔹 Gyanotsav 2.0 Winners
  const winners2 = [
    {
      title: "🥇 1st Winner",
      name: "Abhikarsh",
      school: "NATIONAL PRATHAM ACADEMY, JB GANJ KHERI",
      img: `${process.env.PUBLIC_URL}/G2_Winner1.jpg`,
    },
    {
      title: "🥈 2nd Winner",
      name: "Sarthak Kumar",
      school: "NATIONAL PRATHAM ACADEMY, JB GANJ KHERI",
      img: `${process.env.PUBLIC_URL}/G2_Winner2.jpg`,
    },
    {
      title: "🥉 3rd Winner",
      name: "Aditya Shukla",
      school: "GSM MEMORIAL ACADEMY, BARKHERIA JAT, KHERI",
      img: `${process.env.PUBLIC_URL}/G2_Winner3.jpg`,
    },
  ];

  // 🔹 Gyanotsav 2025 Winners
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

      {/* ================= GYANOTSAV 2.0 ================= */}
      <h2 className="results-subtitle">Gyanotsav 2.0 – Top 3 Winners</h2>
      <div className="winners-section">
        {winners2.map((winner, index) => (
          <div key={index} className="winner-card highlight">
            <img src={winner.img} alt={winner.title} className="winner-img" />
            <h3 className="winner-title">{winner.title}</h3>
            <p className="winner-name"><strong>{winner.name}</strong></p>
            <p className="winner-school">{winner.school}</p>
          </div>
        ))}
      </div>

      {/* 🔹 Gyanotsav 2.0 Gallery */}
      <h2 className="gallery-title">Gyanotsav 2.0 – Gallery</h2>
      <div className="results-grid">
        {gyanotsav2Images.map((src, idx) => (
          <div key={idx} className="result-card">
            <img src={src} alt={`Gyanotsav 2.0 ${idx + 1}`} className="result-img" />
          </div>
        ))}
      </div>

      {/* ================= GYANOTSAV 2025 ================= */}
      <h2 className="results-subtitle">
        Gyanotsav Competition – 2025 Top 3 Winners
      </h2>
      <div className="winners-section">
        {winners.map((winner, index) => (
          <div key={index} className="winner-card">
            <img src={winner.img} alt={winner.title} className="winner-img" />
            <h3 className="winner-title">{winner.title}</h3>
            <p className="winner-name"><strong>{winner.name}</strong></p>
            <p className="winner-school">{winner.school}</p>
          </div>
        ))}
      </div>

      {/* 🔹 Old Gallery */}
      <h2 className="gallery-title">Gyanotsav Competition – 2025 Gallery</h2>
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
