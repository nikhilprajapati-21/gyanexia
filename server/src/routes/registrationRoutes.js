import express from "express";

import {
  createRegistration,
  getMyRegistrations,
  getMyRegistration,
  verifyPayment,
  getAllRegistrations,
} from "../controllers/registrationController.js";

import {
  protect,
  adminOrSuperAdmin,
} from "../middleware/authMiddleware.js";

const router = express.Router();


/*
 * ==========================================
 * ADMIN - ALL COMPETITION REGISTRATIONS
 * ==========================================
 *
 * IMPORTANT:
 * This route must come BEFORE:
 *
 * /my/:id
 *
 * because "admin" must not be treated as
 * a registration ID.
 */

router.get(
  "/admin/all",
  protect,
  adminOrSuperAdmin,
  getAllRegistrations
);


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
 * SINGLE MY REGISTRATION
 * ==========================================
 */

router.get(
  "/my/:id",
  protect,
  getMyRegistration
);


export default router;