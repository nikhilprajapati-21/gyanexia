import React from "react";
import "./About.css";

const About = () => {
  return (
    <div className="about-container">
      <h1 className="about-title">About Us</h1>
      <p className="about-subtitle">
        Welcome to <strong>Gyanexia</strong> — a platform dedicated to empowering minds
        through knowledge and innovation.
      </p>

      <div className="about-content">
        <p>
          Gyanexia was founded with the mission to make education accessible,
          engaging, and impactful. We believe learning should be an experience that
          transforms lives and inspires innovation.
        </p>
        <p>
          Our goal is to bridge the gap between knowledge and opportunity by
          providing resources, competitions, and a supportive community for learners
          and innovators worldwide.
        </p>
      </div>

      <div className="about-highlights">
        <div className="highlight-card">
          <h3>🎯 Our Mission</h3>
          <p>
            To create meaningful opportunities for learning and growth by making
            education interactive and accessible for everyone.
          </p>
        </div>
        <div className="highlight-card">
          <h3>🌍 Our Vision</h3>
          <p>
            To be a global hub of innovation and knowledge sharing, inspiring
            students and professionals to achieve excellence.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
