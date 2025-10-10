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
          At Gyanexia, we believe that every student deserves access to quality education, regardless of their background.
Education opens doors to endless opportunities, and we are committed to making learning engaging, affordable, and accessible for all.
Through our academic competitions, quizzes, and learning programs, we aim to motivate students to study, explore their potential, and develop a lifelong passion for learning.

We especially focus on supporting underprivileged students by providing them with affordable access to educational opportunities, mentorship, and guidance.
Our initiatives are designed to bridge the educational gap and ensure that no student is left behind due to financial or social barriers.
Together, we strive to build a community where knowledge empowers every learner to achieve their dreams
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
