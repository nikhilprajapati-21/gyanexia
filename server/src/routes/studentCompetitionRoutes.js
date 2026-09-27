import express from "express";

import {
  getUpcomingCompetitions,
  getStudentCompetition,
  registerForCompetition,
  getMyCompetitions,
} from "../controllers/studentCompetitionController.js";

import {
  protect,
  studentOnly,
} from "../middleware/authMiddleware.js";

const router = express.Router();


/*
 * ==========================================
 * ALL STUDENT COMPETITION ROUTES
 * ==========================================
 */

router.use(
  protect,
  studentOnly
);


/*
 * ==========================================
 * UPCOMING COMPETITIONS
 * ==========================================
 */

router.get(
  "/upcoming",
  getUpcomingCompetitions
);


/*
 * ==========================================
 * MY REGISTERED COMPETITIONS
 * ==========================================
 */

router.get(
  "/my",
  getMyCompetitions
);


/*
 * ==========================================
 * SINGLE COMPETITION
 * ==========================================
 */

router.get(
  "/:id",
  getStudentCompetition
);


/*
 * ==========================================
 * REGISTER
 * ==========================================
 */

router.post(
  "/:id/register",
  registerForCompetition
);


export default router;