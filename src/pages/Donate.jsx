import React, { useEffect, useRef } from "react";
import "./Donate.css";

const Donate = () => {

  const loaded = useRef(false);
  const paymentButtonId = process.env.REACT_APP_RAZORPAY_PAYMENT_BUTTON_ID;

  useEffect(() => {

    if (loaded.current) return;

    loaded.current = true;

    const form = document.getElementById("razorpay-form");

    if (!form || !paymentButtonId) return;

    // Clear old content
    form.innerHTML = "";

    const script = document.createElement("script");

    script.src =
      "https://checkout.razorpay.com/v1/payment-button.js";

    script.async = true;

    script.setAttribute(
      "data-payment_button_id",
      paymentButtonId
    );

    form.appendChild(script);

  }, [paymentButtonId]);

  return (
    <div className="donate-page">

      {/* Hero Section */}
      <div className="donate-hero">

        <h1>Support Gyanexia ❤️</h1>

        <p>
          Your contribution helps us organize competitions,
          support students, and create better educational
          opportunities through Gyanexia.
        </p>

      </div>

      {/* Donate Card */}
      <div className="donate-card">

        <h2>Make a Contribution</h2>

        <p className="donate-text">
          Every contribution creates opportunities for students
          to learn, compete, and grow.
        </p>

        {/* Razorpay Button */}
        {paymentButtonId ? (
          <form id="razorpay-form"></form>
        ) : (
          <p className="donate-text">Donations are being configured. Please check back soon.</p>
        )}

      </div>

      {/* Footer */}
      <div className="donate-footer">
        <p>
          Thank you for supporting the Gyanexia community 🌟
        </p>
      </div>

    </div>
  );
};

export default Donate;
