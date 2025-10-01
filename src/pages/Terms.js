// src/pages/Terms.js
import React from "react";
import "./LegalPages.css";

const Terms = () => {
  return (
    <div className="legal-container">
      <h1>Terms and Conditions</h1>
      <p><strong>Effective Date:</strong> 01/05/2025</p>
      <p>
        Welcome to <a href="https://www.gyanexia.in/">www.gyanexia.in</a>
        (“we”, “us”, “our”). By accessing or using the website and purchasing our products,
        you agree to the following terms and conditions, which comply with Indian law,
        including the Sale of Goods Act, 1930, and the Consumer Protection Act, 2019.
      </p>

      <h3>1. Parties</h3>
      <p>
        This agreement is between Gyanexia, registered at HNO 105 Sopodera Sarjamda - New Shiv Mandir,
        and you, the customer.
      </p>

      <h3>2. Offer and Acceptance</h3>
      <ul>
        <li>All orders placed on the Site constitute an offer to purchase.</li>
        <li>Acceptance occurs when we send you an order confirmation email.</li>
      </ul>

      <h3>3. Price and Payment</h3>
      <ul>
        <li>All prices are in INR and include applicable taxes unless otherwise stated.</li>
        <li>Payment methods include credit/debit card, UPI, net banking, and others as shown at checkout.</li>
        <li>We reserve the right to correct pricing errors and cancel orders with incorrect pricing.</li>
      </ul>

      <h3>4. Delivery</h3>
      <p>
        Delivery may be via our logistics partners, post, courier, or customer pickup, as selected at checkout.
        Estimated delivery times are provided; delays due to unforeseen circumstances are not our liability.
        Risk transfers to you upon delivery.
      </p>

      <h3>5. Returns and Cancellations</h3>
      <p>Returns, refunds, and cancellations are governed by our Refund & Return Policy.</p>

      <h3>6. Consumer Protection</h3>
      <p>
        You are entitled to statutory rights under Indian law, including the right to return defective goods
        and receive a refund or replacement.
      </p>

      <h3>7. Intellectual Property</h3>
      <p>
        All content on the Site is owned by NIKHIL KUMAR and may not be reproduced without permission.
      </p>

      <h3>8. Limitation of Liability</h3>
      <p>
        Our liability is limited to the purchase price of the product.
        We are not liable for indirect or consequential damages.
      </p>

      <h3>9. Dispute Resolution</h3>
      <p>Disputes are subject to the jurisdiction of courts in Hardoi, India.</p>

      <h3>10. Amendments</h3>
      <p>We may update these terms at any time. Changes will be posted on this page.</p>
    </div>
  );
};

export default Terms;
