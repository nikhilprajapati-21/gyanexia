// src/pages/Disclaimer.js
import React from "react";
import "./LegalPages.css";

const Disclaimer = () => {
  return (
    <div className="legal-container">
      <h1>Disclaimer</h1>
      <p><strong>Effective Date:</strong> 01/10/2025</p>

      <p>
        The information, materials, and resources provided on 
        <a href="https://www.gyanexia.in/"> Gyanexia.in </a> 
        are intended solely for educational and motivational purposes.
      </p>

      <p>
        While we strive to ensure the accuracy and reliability of all content,
        Gyanexia makes no warranties or representations regarding the completeness,
        reliability, or suitability of any information provided.
      </p>

      <p>
        Participation in competitions or events organized by Gyanexia does not guarantee
        any academic, professional, or financial outcomes. All results and rewards are
        subject to fair evaluation and the terms outlined for each event.
      </p>

      <p>
        Gyanexia shall not be held liable for any loss, damage, or inconvenience
        arising from the use of our website, participation in competitions,
        or reliance on the provided materials.
      </p>

      <p>
        By using our platform, you acknowledge and agree to this disclaimer.
      </p>
    </div>
  );
};

export default Disclaimer;
