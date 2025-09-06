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
          At Gyanexia, we believe that every student deserves access to quality 
          education, no matter their background. Education is the key to opening
           doors of opportunity, and we are committed to making learning affordable
            and accessible for all. Our platform is designed to support underprivileged 
            students by providing them with the knowledge, resources, and guidance they need to succeed.
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
            Our mission is to provide quality education at minimum fees so that underprivileged
             students can dream big, learn better, and achieve their goals. We aim to bridge 
             the gap between talent and opportunity by creating a fair and supportive learning environment.
          </p>
        </div>
        <div className="highlight-card">
          <h3>🌍 Our Vision</h3>
          <p>
            Our vision is to build a future where no child is left behind because of financial barriers. 
            We want to empower students with knowledge, skills, and confidence, so they can contribute 
            to society and create a brighter tomorrow for themselves and others.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
