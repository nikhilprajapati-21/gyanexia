
import express from "express";

import {
  createDonationOrder,
  verifyDonationPayment,
} from "../controllers/donationController.js";

const router = express.Router();

// Create donation order
router.post(
  "/create-order",
  createDonationOrder
);

// Verify donation payment
router.post(
  "/verify-payment",
  verifyDonationPayment
);

export default router;
