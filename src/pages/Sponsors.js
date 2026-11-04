import React from "react";
import "./Sponsors.css";

const Sponsors = () => {
  return (
    <div className="sponsors-container">
      <div className="sponsors-content">

        <span className="sponsors-tag">PARTNER WITH GYANEXIA</span>

        <h1 className="sponsors-title">
          Our Partners <span>& Sponsors</span>
        </h1>

        <p className="sponsors-subtitle">
          Together, let's encourage young minds and create opportunities
          through education.
        </p>

        {/* Invitation Section */}
        <div className="sponsors-card">
          <div className="sponsors-icon">🤝</div>

          <h2>Be a Part of the Change!</h2>

          <p>
            Gyanexia welcomes organisations, companies, businesses and
            individuals who believe in supporting education and encouraging
            young talent in rural communities.
          </p>

          <p>
            Your support can help us organise academic competitions, reward
            deserving students and provide meaningful learning opportunities.
          </p>

          <div className="sponsors-support">
            <h3>How Can You Support Us?</h3>

            <div className="support-grid">
              <div className="support-item">
                <span>💰</span>
                <h4>Financial Support</h4>
                <p>Help us organise educational events and competitions.</p>
              </div>

              <div className="support-item">
                <span>📚</span>
                <h4>Educational Products</h4>
                <p>Contribute stationery, books and learning materials.</p>
              </div>

              <div className="support-item">
                <span>🏆</span>
                <h4>Prizes & Rewards</h4>
                <p>Help recognise and reward talented students.</p>
              </div>

              <div className="support-item">
                <span>🏢</span>
                <h4>Event Partnership</h4>
                <p>Collaborate with us to create educational opportunities.</p>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="sponsors-contact">
            <h3>Become a Gyanexia Partner</h3>

            <p>
              Interested in supporting our initiative? We would love to
              hear from you.
            </p>

            <div className="sponsors-contact-details">
              <a href="mailto:gyanexia@gmail.com">
                ✉️ gyanexia@gmail.com
              </a>

              <a href="https://wa.me/918840284749" target="_blank" rel="noreferrer">
                📱 +91 8840284749
              </a>
            </div>

            <a
              href="mailto:gyanexia@gmail.com?subject=Sponsorship%20Enquiry%20-%20Gyanexia"
              className="sponsors-button"
            >
              Become a Sponsor <span>→</span>
            </a>
          </div>
        </div>

        {/* Future Sponsors Section */}
        <div className="future-sponsors">
          <h2>Our Growing Partnership Network</h2>

          <p>
            We look forward to welcoming organisations and individuals
            who share our vision of encouraging education and young talent.
          </p>

          <div className="future-sponsors-note">
            <span>🌱</span>
            <p>
              Sponsor and partner acknowledgements will be featured here
              as collaborations are confirmed.
            </p>
          </div>
        </div>

        <div className="sponsors-footer">
          <h3>Gyanexia</h3>
          <p>Think Smart. Understand Concepts. Excel!</p>

          <a href="https://www.gyanexia.in" target="_blank" rel="noreferrer">
            www.gyanexia.in
          </a>
        </div>

      </div>
    </div>
  );
};

export default Sponsors;