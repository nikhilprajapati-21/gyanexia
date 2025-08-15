import React from "react";
import "./PreviousResults.css";

export default function PreviousResults() {
  // Change this number when you add more images
  const totalImages = 8;

  // Generate /result1.jpg, /result2.jpg, ...
  const images = Array.from({ length: totalImages }, (_, i) => `/result${i + 1}.jpg`);

  return (
    <div className="results-container">
      <h1 className="results-title">Previous Results</h1>
      <h2 className="results-subtitle">Gyanotsav Competition-2025</h2>

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
