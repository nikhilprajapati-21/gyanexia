// src/pages/Privacy.js
import React from "react";
import "./LegalPages.css";

const Privacy = () => {
  return (
    <div className="legal-container">
      <h1>Privacy Policy</h1>
      <p><strong>Effective Date:</strong> 01/05/2025</p>
      <p>
        Our website is committed to protecting your privacy in accordance with the Information Technology
        (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011.
      </p>

      <h3>1. Information We Collect</h3>
      <ul>
        <li><strong>Personal Data:</strong> Name, address, email, phone number, payment details, purchase history.</li>
        <li><strong>Automatically Collected Data:</strong> IP address, browser type, device info, cookies, tracking data.</li>
      </ul>

      <h3>2. How We Use Your Information</h3>
      <ul>
        <li>To process orders, deliver products, and provide customer support.</li>
        <li>To improve our services and communicate with you about offers or updates.</li>
      </ul>

      <h3>3. Disclosure of Information</h3>
      <p>
        We do not sell or rent your personal information.
        Data may be shared with third parties (e.g., payment processors, courier partners) solely to fulfill your order.
      </p>

      <h3>4. Security</h3>
      <p>We use industry-standard security measures to protect your data.</p>

      <h3>5. Your Rights</h3>
      <p>You may request access, correction, or deletion of your personal information by contacting us.</p>

      <h3>6. Policy Updates</h3>
      <p>We may update this policy; changes will be posted here.</p>
    </div>
  );
};

export default Privacy;
