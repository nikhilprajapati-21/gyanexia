// src/pages/Terms.js
import React from "react";
import "./LegalPages.css";

const Terms = () => {
  return (
    <div className="legal-container">
      <h1>Terms and Conditions</h1>
      <p><strong>Effective Date:</strong> 01/10/2025</p>

      <p>
        Welcome to <a href="https://www.gyanexia.in/">www.gyanexia.in</a> (“we”, “us”, “our”). 
        By accessing or using our website, registering for events, or making a payment, 
        you agree to comply with and be bound by these Terms and Conditions. 
        These terms are governed by applicable Indian laws, including the Information Technology Act, 2000, 
        and the Consumer Protection Act, 2019.
      </p>

      <h3>1. About Gyanexia</h3>
      <p>
        Gyanexia is an educational initiative aimed at promoting academic excellence, innovation, and learning opportunities 
        for students from Classes 5th to 12th through competitions, programs, and events conducted online and offline.
      </p>

      <h3>2. Registration and Participation</h3>
      <ul>
        <li>Participants must provide accurate personal and academic information during registration.</li>
        <li>Registrations are considered confirmed only after successful payment and verification by the Gyanexia team.</li>
        <li>Any misuse, false information, or misconduct may lead to disqualification without refund.</li>
      </ul>

      <h3>3. Payments</h3>
      <ul>
        <li>All payments are accepted through secure online gateways as listed on our website.</li>
        <li>Fees once paid are non-transferable and subject to our <a href="/refund">Refund Policy</a>.</li>
        <li>Payment confirmation will be sent to your registered email after successful transaction.</li>
      </ul>

      <h3>4. Use of Website</h3>
      <ul>
        <li>You agree not to misuse the website for any unlawful activities or to disrupt its functionality.</li>
        <li>All content including text, images, graphics, and materials belong to Gyanexia and may not be copied or redistributed without permission.</li>
      </ul>

      <h3>5. Privacy and Data Protection</h3>
      <p>
        We value your privacy. Personal data collected during registration or website use is processed in accordance with our 
        <a href="/privacy"> Privacy Policy</a>. 
        Gyanexia ensures reasonable security measures to protect your information.
      </p>

      <h3>6. Certificates, Results, and Recognition</h3>
      <p>
        Certificates or recognition will be issued based on merit and participation. 
        Gyanexia reserves the right to review or withhold certificates in case of any irregularity or rule violation.
      </p>

      <h3>7. Limitation of Liability</h3>
      <p>
        Gyanexia is not liable for any indirect, incidental, or consequential damages arising from the use of our platform or participation in events. 
        Our liability, if any, shall not exceed the total fee paid for registration.
      </p>

      <h3>8. Intellectual Property</h3>
      <p>
        All materials, designs, content, and logos on the Gyanexia website are the intellectual property of Nikhil Kumar (Founder, Gyanexia) 
        and are protected under applicable copyright laws.
      </p>

      <h3>9. Dispute Resolution</h3>
      <p>
        In the event of a dispute, parties shall first attempt an amicable resolution. 
        If unresolved, disputes are subject to the exclusive jurisdiction of courts in Hardoi, Uttar Pradesh, India.
      </p>

      <h3>10. Updates to Terms</h3>
      <p>
        We may modify these Terms and Conditions periodically. 
        Updated versions will be posted on this page with the revised effective date. 
        Continued use of our services implies acceptance of the updated terms.
      </p>
    </div>
  );
};

export default Terms;
