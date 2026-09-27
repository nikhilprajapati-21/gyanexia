import express from "express";

import {
  createRegistration,
  getMyRegistrations,
  getMyRegistration,
  verifyPayment,
} from "../controllers/registrationController.js";

import { protect } from "../middleware/authMiddleware.js";

const router =
  express.Router();


/*
 * ==========================================
 * CREATE REGISTRATION + RAZORPAY ORDER
 * ==========================================
 */

router.post(
  "/",
  protect,
  createRegistration
);


/*
 * ==========================================
 * VERIFY RAZORPAY PAYMENT
 * ==========================================
 */

router.post(
  "/verify-payment",
  protect,
  verifyPayment
);


/*
 * ==========================================
 * MY REGISTRATIONS
 * ==========================================
 */

router.get(
  "/my",
  protect,
  getMyRegistrations
);


/*
 * ==========================================
 * SINGLE REGISTRATION
 * ==========================================
 */

router.get(
  "/my/:id",
  protect,
  getMyRegistration
);


export default router;