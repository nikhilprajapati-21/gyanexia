
import crypto from "crypto";
import Razorpay from "razorpay";
import Donation from "../models/Donation.js";

// Reuse existing Razorpay Live credentials
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


/*
 * ==========================================
 * CREATE DONATION ORDER
 * ==========================================
 */

export const createDonationOrder = async (
  request,
  response,
  next
) => {
  try {
    const amount = Number(request.body.amount);

    // Validate amount in rupees
    if (
      !Number.isSafeInteger(amount) ||
      amount < 1 ||
      amount > 100000
    ) {
      return response.status(400).json({
        message:
          "Please enter a valid donation amount between ₹1 and ₹1,00,000.",
      });
    }

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",

      receipt: `donation_${crypto.randomUUID()}`,

      notes: {
        purpose: "Gyanexia Donation",
      },
    });

    // Save pending donation
    await Donation.create({
      amount,
      currency: "INR",
      razorpayOrderId: order.id,
      paymentStatus: "pending",
    });

    return response.status(201).json({
      message: "Donation order created successfully.",

      keyId: process.env.RAZORPAY_KEY_ID,

      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
      },
    });

  } catch (error) {
    console.error(
      "CREATE DONATION ORDER ERROR:",
      error
    );

    return next(error);
  }
};


/*
 * ==========================================
 * VERIFY DONATION PAYMENT
 * ==========================================
 */

export const verifyDonationPayment = async (
  request,
  response,
  next
) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = request.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return response.status(400).json({
        message:
          "Incomplete Razorpay payment details.",
      });
    }

    // Find the donation order
    const donation = await Donation.findOne({
      razorpayOrderId: razorpay_order_id,
    });

    if (!donation) {
      return response.status(404).json({
        message: "Donation order not found.",
      });
    }

    // Idempotency: already verified
    if (donation.paymentStatus === "paid") {
      if (
        donation.razorpayPaymentId !==
        razorpay_payment_id
      ) {
        return response.status(400).json({
          message: "Payment ID does not match.",
        });
      }

      return response.status(200).json({
        message: "Donation payment already verified.",
        donation,
      });
    }

    // Verify Razorpay signature
    const generatedSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET
      )
      .update(
        `${razorpay_order_id}|${razorpay_payment_id}`
      )
      .digest("hex");

    const received = Buffer.from(
      razorpay_signature,
      "hex"
    );

    const generated = Buffer.from(
      generatedSignature,
      "hex"
    );

    if (
      received.length !== generated.length ||
      !crypto.timingSafeEqual(received, generated)
    ) {
      return response.status(400).json({
        message: "Payment signature verification failed.",
      });
    }

    // Fetch actual payment details from Razorpay
    const payment = await razorpay.payments.fetch(
      razorpay_payment_id
    );

    // Confirm payment belongs to this order
    if (payment.order_id !== razorpay_order_id) {
      return response.status(400).json({
        message: "Payment order does not match.",
      });
    }

    // Confirm amount and currency
    if (
      Number(payment.amount) !== donation.amount * 100 ||
      payment.currency !== donation.currency
    ) {
      return response.status(400).json({
        message: "Payment amount does not match.",
      });
    }

    // Only captured payments count as successful
    if (payment.status !== "captured") {
      return response.status(400).json({
        message:
          "Payment has not been captured yet. Please contact support if money was deducted.",
      });
    }

    // Save verified payment
    donation.razorpayPaymentId =
      razorpay_payment_id;

    donation.razorpaySignature =
      razorpay_signature;

    donation.paymentStatus = "paid";

    donation.paidAt = new Date();

    await donation.save();

    return response.status(200).json({
      message: "Donation payment verified successfully.",
      donation: {
        amount: donation.amount,
        currency: donation.currency,
        paymentStatus: donation.paymentStatus,
        paidAt: donation.paidAt,
      },
    });

  } catch (error) {
    console.error(
      "VERIFY DONATION PAYMENT ERROR:",
      error
    );

    return next(error);
  }
};
