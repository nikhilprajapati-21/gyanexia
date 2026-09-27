import express from "express";

import {
  getResults,
  getStudentResults,
  getCompetitionResults,
  addOrUpdateResult,
  publishResults,
  unpublishResults,
} from "../controllers/resultController.js";

import {
  protect,
  adminOrSuperAdmin,
  superAdminOnly,
} from "../middleware/authMiddleware.js";

const router = express.Router();


/*
 * ==========================================
 * GET PUBLISHED RESULTS FOR STUDENT
 *
 * STUDENT ONLY
 * ==========================================
 *
 * IMPORTANT:
 * This route MUST come before:
 *
 * router.use(protect, adminOrSuperAdmin)
 *
 * because students are not admins.
 */

router.get(
  "/student",
  protect,
  getStudentResults
);


/*
 * ==========================================
 * ALL ADMIN / SUPERADMIN RESULT ROUTES
 * ==========================================
 */

router.use(
  protect,
  adminOrSuperAdmin
);


/*
 * ==========================================
 * GET ALL RESULTS
 *
 * ADMIN + SUPERADMIN
 * ==========================================
 */

router.get(
  "/",
  getResults
);


/*
 * ==========================================
 * GET RESULTS FOR ONE COMPETITION
 *
 * ADMIN + SUPERADMIN
 * ==========================================
 */

router.get(
  "/competition/:competitionId",
  getCompetitionResults
);


/*
 * ==========================================
 * ADD / UPDATE MARKS
 *
 * ADMIN + SUPERADMIN
 * ==========================================
 */

router.post(
  "/",
  addOrUpdateResult
);


/*
 * ==========================================
 * PUBLISH RESULTS
 *
 * SUPERADMIN ONLY
 * ==========================================
 */

router.post(
  "/competition/:competitionId/publish",
  superAdminOnly,
  publishResults
);


/*
 * ==========================================
 * UNPUBLISH RESULTS
 *
 * SUPERADMIN ONLY
 * ==========================================
 */

router.post(
  "/competition/:competitionId/unpublish",
  superAdminOnly,
  unpublishResults
);


export default router;