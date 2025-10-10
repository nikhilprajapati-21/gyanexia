// src/pages/Refund.js
import React from "react";
import "./LegalPages.css";

const Refund = () => {
  return (
    <div className="legal-container">
      <h1>Refund Policy</h1>

      <p>
        At <strong>Gyanexia</strong>, we strive to ensure a fair and transparent refund process for all participants.
      </p>

      <h3>1. Eligibility for Refund</h3>
      <p>
        Refunds are applicable only if a cancellation request is made within{" "}
        <strong>48 hours of registration</strong> and before the event or program
        has commenced.
      </p>

      <h3>2. Refund Timeline</h3>
      <p>
        Once approved, the refund will be processed and credited to the same mode
        of payment within <strong>10 working days</strong>.
      </p>

      <h3>3. Non-Refundable Cases</h3>
      <ul>
        <li>After event commencement or participation confirmation.</li>
        <li>If incorrect information is provided during registration.</li>
        <li>In case of violation of terms and conditions.</li>
      </ul>

      <h3>4. Contact for Refund</h3>
      <p>
        For refund-related queries, please contact us at{" "}
        <a href="mailto:prajapati09297@gmail.com">prajapati09297@gmail.com</a>{" "}
        or call us at <strong>+91 8840284749</strong>.
      </p>

      <p>
        <em>Note: All refund decisions are subject to Gyanexia’s final discretion.</em>
      </p>
    </div>
  );
};

export default Refund;
