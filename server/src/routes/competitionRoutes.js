import express from "express";

import {
  getStudentCompetitions,
  getCompetitions,
  getCompetition,

  createCompetition,
  updateCompetition,
  deleteCompetition,

  openRegistration,
  closeRegistration,

  completeCompetition,
  publishCompetitionResults,
} from "../controllers/competitionController.js";

import {
  protect,
  studentOnly,
  adminOrSuperAdmin,
  superAdminOnly,
} from "../middleware/authMiddleware.js";

const router = express.Router();


/*
 * ==========================================
 * PUBLIC ROUTES
 * ==========================================
 */


/*
 * Student upcoming route
 *
 * This specific route MUST come before /:id.
 */

router.get(
  "/student/upcoming",
  protect,
  studentOnly,
  getStudentCompetitions
);


/*
 * Public upcoming competitions
 */

router.get(
  "/upcoming",
  getCompetitions
);


/*
 * Public all competitions
 */

router.get(
  "/",
  getCompetitions
);


/*
 * Public single competition
 */

router.get(
  "/:id",
  getCompetition
);


/*
 * ==========================================
 * ADMIN + SUPERADMIN ROUTES
 * ==========================================
 */

router.use(
  protect,
  adminOrSuperAdmin
);


/*
 * CREATE
 */

router.post(
  "/",
  superAdminOnly,
  createCompetition
);


/*
 * UPDATE
 */

router.patch(
  "/:id",
  superAdminOnly,
  updateCompetition
);


/*
 * DELETE
 */

router.delete(
  "/:id",
  superAdminOnly,
  deleteCompetition
);


/*
 * OPEN REGISTRATION
 */

router.patch(
  "/:id/open-registration",
  superAdminOnly,
  openRegistration
);


/*
 * CLOSE REGISTRATION
 */

router.patch(
  "/:id/close-registration",
  superAdminOnly,
  closeRegistration
);


/*
 * COMPLETE COMPETITION
 */

router.patch(
  "/:id/complete",
  superAdminOnly,
  completeCompetition
);


/*
 * PUBLISH RESULTS
 */

router.patch(
  "/:id/publish-results",
  superAdminOnly,
  publishCompetitionResults
);


export default router;