import React, { useState, useEffect } from 'react';
import './Home.css';

const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="home-container">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="header-flex">
            {/* Logo */}
            <div className="logo">
              <div className="logo-icon"></div>
              <span className="logo-text">Gyanexia</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="desktop-nav">
              <a href="#" className="nav-link">Home</a>
              <a href="#" className="nav-link">About</a>
              <a href="#" className="nav-link">Previous Results</a>
              <a href="#" className="nav-link">Competitions</a>
              <a href="#" className="nav-link">Contact Us</a>
            </nav>

            {/* Mobile menu button */}
            <button className="mobile-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? '✕' : '☰'}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="mobile-nav">
              <nav className="mobile-nav-links">
                <a href="#" className="nav-link">Home</a>
                <a href="#" className="nav-link">About</a>
                <a href="#" className="nav-link">Previous Results</a>
                <a href="#" className="nav-link">Competitions</a>
                <a href="#" className="nav-link">Contact Us</a>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className={`hero-text ${isVisible ? 'visible' : ''}`}>
            <h1 className="hero-title">
              Welcome to <span className="hero-highlight">Gyanexia</span>
            </h1>
            <p className="hero-description">
              Empowering minds through knowledge and innovation. Your journey to excellence starts here.
            </p>
            <div className="hero-buttons">
              <button className="btn-primary">Explore Our Services</button>
              <button className="btn-secondary">Learn More</button>
            </div>
          </div>
        </div>
      </section>

      {/* Meet Our Founder Section */}
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
                    <img
                    //   src="/nikhil.jpg"
                    //   alt="Nikhil Prajapati"
                      className="founder-img"
                    />
                  </div>
                </div>

                <div className="founder-details">
                  <div className="founder-info">
                    <div className="founder-name-section">
                      <h3 className="founder-name">Nikhil Prajapati</h3>
                      <p className="founder-title">Founder</p>
                    </div>

                    <p className="founder-bio">
                     Hii, I am Nikhil Prajapati, a student at IIT Kanpur and the founder of Gyanexia.
                    </p>

                    <blockquote className="founder-quote">
                      "Education is the most powerful weapon which you can use to change the world." - This philosophy
                      drives everything we do at Gyanexia.
                    </blockquote>

                    <div className="contact-info">
                      <div className="contact-item">
                        <span className="contact-icon">📞</span>
                        <span>+91 8429287344</span>
                      </div>
                      <div className="contact-item">
                        <span className="contact-icon">✉️</span>
                        <span>founder@gyanexia.com</span>
                      </div>
                      <div className="contact-item">
                        <span className="contact-icon">💼</span>
                        <span>Connect on LinkedIn</span>
                      </div>
                    </div>

                    <button className="contact-btn">
                      <span className="btn-icon">✉️</span>
                      Get in Touch
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="mission-section">
        <div className="section-content">
          <h2 className="section-title">Our Mission</h2>
          <p className="mission-text">
            At Gyanexia, we believe in the power of knowledge to transform lives. We're dedicated to providing
            innovative solutions that make learning accessible, engaging, and effective for everyone.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-grid">
            {/* Company Info */}
            <div className="footer-company">
              <div className="footer-logo">
                <span className="footer-logo-icon"></span>
                <span className="footer-logo-text">Gyanexia</span>
              </div>
              <p className="footer-description">
                Empowering minds through knowledge and innovation. Your journey to excellence starts here.
              </p>
              <div className="social-links">
                <div className="social-icon">💼</div>
                <div className="social-icon">✉️</div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="footer-links">
              <h3 className="footer-heading">Quick Links</h3>
              <ul className="footer-list">
                <li><a href="#" className="footer-link">Home</a></li>
                <li><a href="#" className="footer-link">About</a></li>
                <li><a href="#" className="footer-link">Services</a></li>
                <li><a href="#" className="footer-link">Competitions</a></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="footer-contact">
              <h3 className="footer-heading">Contact</h3>
              <ul className="footer-list">
                <li className="footer-contact-item">
                  <span className="footer-contact-icon">📞</span>
                  <span>+91 8429287344</span>
                </li>
                <li className="footer-contact-item">
                  <span className="footer-contact-icon">✉️</span>
                  <span>info@gyanexia.com</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p className="footer-copyright">
              &copy; {new Date().getFullYear()} Gyanexia. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;