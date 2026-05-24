import React from "react";
import { Link } from "react-router-dom";
import "./ThankYou.css";

const ThankYou = () => {
  return (
    <div className="thankyou-page">

      <div className="thankyou-card">

        <div className="thankyou-icon">
          ❤️
        </div>

        <h1>Thank You for Your Support!</h1>

        <p className="thankyou-text">
          Your contribution means a lot to the Gyanexia community.
        </p>

        <p className="thankyou-message">
          Your donation will help us support educational opportunities,
          organize competitions, and create initiatives for
          underprivileged students.
        </p>

        <p className="thankyou-footer">
          Together, we are building a brighter future through education 🌟
        </p>

        <Link to="/" className="home-btn">
          Back to Home
        </Link>

      </div>

    </div>
  );
};

export default ThankYou;