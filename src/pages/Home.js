import React, { useEffect, useState } from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  // Slider state
  const images = [
    "/Result1.jpg",
    "/Result2.jpg",
    "/Result3.jpg",
    "/Result4.jpeg",
    "/Result5.jpg",
    "/Result6.jpeg",
    "/Result7.jpeg",
    "/Result8.jpeg",
  ];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === images.length - 1 ? 0 : prev + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

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
              Empowering minds through knowledge and innovation. Your journey to
              excellence starts here.
            </p>

            {/* Scrolling Announcement */}
            <div className="marquee-container">
              <div className="marquee-content">
                <span>📢 New Competition & Activity Coming Soon – Stay Tuned with Gyanexia!</span>
                <span>📢 New Competition & Activity Coming Soon – Stay Tuned with Gyanexia!</span>
                <span>📢 New Competition & Activity Coming Soon – Stay Tuned with Gyanexia!</span>
                <span>📢 New Competition & Activity Coming Soon – Stay Tuned with Gyanexia!</span>
                <span>📢 New Competition & Activity Coming Soon – Stay Tuned with Gyanexia!</span>
              </div>
            </div>
            {/* ❌ Register button removed */}
          </div>
        </div>
      </section>

      {/* Slider Section */}
      <section className="slider-section">
        <div className="slider-container">
          <button className="slider-btn prev" onClick={handlePrev}>
            &#10094;
          </button>

          <div className="slider-image-container">
            <img
              src={images[currentIndex]}
              alt="Slide"
              className="slider-image"
            />
          </div>

          <button className="slider-btn next" onClick={handleNext}>
            &#10095;
          </button>
        </div>
      </section>

      {/* Founder Section */}
      <section className="founder-section">
        <div className="section-content">
          <div className="section-header">
            <h2 className="section-title">Meet Our Founder</h2>
            <p className="section-description">
              "At Gyanexia, our mission is to transform quality education and
              knowledge sharing into an accessible and impactful experience for
              all."
            </p>
          </div>

          <div className="founder-card-container">
            <div className="founder-card">
              <div className="founder-card-content">
                <div className="founder-image-container">
                  <div className="founder-image"></div>
                </div>

                <div className="founder-details">
                  <div className="founder-info">
                    <h3 className="founder-name">Nikhil Prajapati</h3>
                    <p className="founder-title">Founder</p>
                    <p className="founder-bio">
                      Hi, I am Nikhil Prajapati, a student at IIT Kanpur and the
                      founder of Gyanexia.
                    </p>
                    <blockquote className="founder-quote">
                      “Talent is everywhere, but opportunity is not. We’re here to
                      ensure every student gets a fair chance.”
                    </blockquote>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default Home;
