import React, { useEffect, useState } from "react";
import "./Home.css";

const Home = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className={`hero-text ${isVisible ? "visible" : ""}`}>
            <h1 className="hero-title">
              Welcome to <span className="hero-highlight">Gyanexia</span>
            </h1>
            <p className="hero-description">
              Empowering minds through knowledge and innovation. Your journey to excellence starts here.
            </p>

            {/* Scrolling Announcement */}
            <div className="marquee-container">
              <div className="marquee-content">
                <span>Upcoming Competition in December 2025 - "Gyanotsav 2.0"</span>
                <span>Registration will start from 1st October 2025!</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="founder-section">
        <div className="section-content">
          <div className="section-header">
            <h2 className="section-title">Meet Our Founder</h2>
            <p className="section-description">
              "At Gyanexia, our mission is to transform quality education and knowledge sharing into an accessible and impactful experience for all."
            </p>
          </div>

          <div className="founder-card-container">
            <div className="founder-card">
              <div className="founder-card-content">
                <div className="founder-image-container">
                  <div className="founder-image">
                    <img className="founder-img" alt="Founder" />
                  </div>
                </div>
                <div className="founder-details">
                  <div className="founder-info">
                    <h3 className="founder-name">Nikhil Prajapati</h3>
                    <p className="founder-title">Founder</p>
                    <p className="founder-bio">
                      Hi, I am Nikhil Prajapati, a student at IIT Kanpur and the founder of Gyanexia.
                    </p>
                    <blockquote className="founder-quote">
                      "Education is the most powerful weapon which you can use to change the world."
                    </blockquote>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section">
        <div className="section-content">
          <h2 className="section-title">Our Mission</h2>
          <p className="mission-text">
            At Gyanexia, we believe in the power of knowledge to transform lives. We're dedicated to providing
            innovative solutions that make learning accessible, engaging, and effective for everyone.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;
