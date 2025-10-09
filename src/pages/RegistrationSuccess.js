import React from "react";
import "./Competitions.css"; // reuse styles

export default function RegistrationSuccess() {
  return (
    <div className="upcoming-container">
      <div className="competition-card">
        <h2>✅ Registration Successful!</h2>
        <p>
          Your registration has been submitted successfully. <br />
          You will receive a confirmation once our team verifies your details.
        </p>
      </div>
    </div>
  );
}
