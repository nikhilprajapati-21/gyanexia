
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Donate.css";
import { API_BASE_URL } from "../services/api";

const API_URL = API_BASE_URL;

const Donate = () => {
  const navigate = useNavigate();

  const [selectedAmount, setSelectedAmount] = useState(500);
  const [customAmount, setCustomAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [error, setError] = useState("");

  // Load Razorpay Checkout script
  useEffect(() => {
    if (window.Razorpay) {
      setScriptLoaded(true);
      return;
    }

    const script = document.createElement("script");

    script.src =
      "https://checkout.razorpay.com/v1/checkout.js";

    script.async = true;

    script.onload = () => {
      setScriptLoaded(true);
    };

    script.onerror = () => {
      setError(
        "Unable to load Razorpay. Please refresh the page."
      );
    };

    document.body.appendChild(script);

    return () => {
      // Keep Razorpay script available for future pages.
    };
  }, []);

  // Calculate donation amount
  const donationAmount =
    selectedAmount === "custom"
      ? Number(customAmount)
      : Number(selectedAmount);

  // Handle donation
  const handleDonation = async () => {
    setError("");

    // Validate amount
    if (
      !Number.isSafeInteger(donationAmount) ||
      donationAmount < 1 ||
      donationAmount > 100000
    ) {
      setError(
        "Please enter a valid donation amount between ₹1 and ₹1,00,000."
      );
      return;
    }

    if (!scriptLoaded || !window.Razorpay) {
      setError(
        "Razorpay is loading. Please try again."
      );
      return;
    }

    try {
      setLoading(true);

      // STEP 1: CREATE DONATION ORDER
      const response = await fetch(
        `${API_URL}/donations/create-order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: donationAmount,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          "Unable to create donation order."
        );
      }

      // Validate backend response
      if (
        !data.keyId ||
        !data.order?.id ||
        !data.order?.amount
      ) {
        throw new Error(
          "Invalid payment order received from server."
        );
      }

      // STEP 2: OPEN RAZORPAY CHECKOUT
      const options = {
        key: data.keyId,

        amount: data.order.amount,

        currency: data.order.currency || "INR",

        name: "Gyanexia",

        description:
          "Support Gyanexia Educational Initiative",

        order_id: data.order.id,

        theme: {
          color: "#635BFF",
        },

        handler: async function (paymentResponse) {
          try {
            setLoading(true);
            setError("");

            // STEP 3: VERIFY PAYMENT
            const verifyResponse = await fetch(
              `${API_URL}/donations/verify-payment`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  razorpay_order_id:
                    paymentResponse.razorpay_order_id,

                  razorpay_payment_id:
                    paymentResponse.razorpay_payment_id,

                  razorpay_signature:
                    paymentResponse.razorpay_signature,
                }),
              }
            );

            const verifyData =
              await verifyResponse.json();

            if (!verifyResponse.ok) {
              throw new Error(
                verifyData.message ||
                "Payment verification failed."
              );
            }

            // STEP 4: REDIRECT AFTER VERIFIED PAYMENT
            if (
              verifyData.donation?.paymentStatus !== "paid"
            ) {
              throw new Error(
                "Donation payment is not yet confirmed."
              );
            }

            navigate("/thank-you", {
              replace: true,
            });

          } catch (err) {
            console.error(
              "Donation verification error:",
              err
            );

            setError(
              err.message ||
              "Payment verification failed. Please contact Gyanexia."
            );

          } finally {
            setLoading(false);
          }
        },

        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      const razorpay =
        new window.Razorpay(options);

      razorpay.on(
        "payment.failed",
        function (paymentFailure) {
          console.error(
            "Razorpay payment failed:",
            paymentFailure
          );

          setError(
            paymentFailure.error?.description ||
            "Payment failed. Please try again."
          );

          setLoading(false);
        }
      );

      razorpay.open();

    } catch (err) {
      console.error(
        "DONATION ERROR:",
        err
      );

      setError(
        err.message ||
        "Unable to process donation. Please try again."
      );

      setLoading(false);
    }
  };

  return (
    <div className="donate-page">

      {/* HERO SECTION */}
      <div className="donate-hero">

        <h1>Support Gyanexia ❤️</h1>

        <p>
          Your contribution helps us organize competitions,
          support students, and create better educational
          opportunities through Gyanexia.
        </p>

      </div>

      {/* DONATION CARD */}
      <div className="donate-card">

        <h2>Make a Contribution</h2>

        <p className="donate-text">
          Every contribution creates opportunities for students
          to learn, compete, and grow.
        </p>

        <h3>Choose Donation Amount</h3>

        {/* PRESET AMOUNTS */}
        <div className="donation-amounts">

          {[100, 200, 500, 1000, 2000].map(
            (amount) => (
              <button
                key={amount}
                type="button"
                className={
                  selectedAmount === amount
                    ? "active"
                    : ""
                }
                onClick={() => {
                  setSelectedAmount(amount);
                  setError("");
                }}
                disabled={loading}
              >
                ₹{amount.toLocaleString("en-IN")}
              </button>
            )
          )}

        </div>

        {/* CUSTOM AMOUNT */}
        <button
          type="button"
          className={
            selectedAmount === "custom"
              ? "custom-donation active"
              : "custom-donation"
          }
          onClick={() => {
            setSelectedAmount("custom");
            setError("");
          }}
          disabled={loading}
        >
          Enter Custom Amount
        </button>

        {selectedAmount === "custom" && (
          <input
            type="number"
            min="1"
            max="100000"
            step="1"
            placeholder="Enter donation amount in ₹"
            value={customAmount}
            onChange={(event) => {
              setCustomAmount(event.target.value);
              setError("");
            }}
            className="donation-input"
            disabled={loading}
          />
        )}

        {/* ERROR MESSAGE */}
        {error && (
          <div className="donation-error">
            {error}
          </div>
        )}

        {/* DONATE BUTTON */}
        <button
          type="button"
          className="donate-pay-btn"
          onClick={handleDonation}
          disabled={loading || !scriptLoaded}
        >
          {loading
            ? "Processing..."
            : !scriptLoaded
              ? "Loading Payment..."
              : `Donate ₹${Number(
                  donationAmount || 0
                ).toLocaleString("en-IN")} ❤️`}
        </button>

        <p className="donation-secure">
          🔒 Secure payments powered by Razorpay
        </p>

      </div>

      {/* FOOTER */}
      <div className="donate-footer">

        <p>
          Thank you for supporting the Gyanexia community 🌟
        </p>

      </div>

    </div>
  );
};

export default Donate;
