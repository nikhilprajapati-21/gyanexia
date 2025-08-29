import React from "react";
import "./Sponsors.css";

const Sponsors = () => {
  const sponsors = [
    { id: 1, name: "Sponsor One", logo: "/sponsors/s1.png" },
    { id: 2, name: "Sponsor Two", logo: "/sponsors/s2.png" },
    { id: 3, name: "Sponsor Three", logo: "/sponsors/s3.png" },
    { id: 4, name: "Sponsor Four", logo: "/sponsors/s4.png" },
  ];

  return (
    <div className="sponsors-container">
      <h1 className="sponsors-title">Our Sponsors</h1>
      <p className="sponsors-subtitle">
        We are grateful to our amazing sponsors for their valuable support.
      </p>
      {/* <div className="sponsors-grid">
        {sponsors.map((sponsor) => (
          <div key={sponsor.id} className="sponsor-card">
            <img
              src={sponsor.logo}
              alt={sponsor.name}
              className="sponsor-logo"
            />
            <h3 className="sponsor-name">{sponsor.name}</h3>
          </div>
        ))}
      </div> */}
    </div>
  );
};

export default Sponsors;
