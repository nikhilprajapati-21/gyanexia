import express from "express";

import {
  getUsers,
  updateStudent,
  deleteStudent,
  makeAdmin,
  removeAdmin,

  getCertificates,
  createCertificate,
  deleteCertificate,
} from "../controllers/adminController.js";

import {
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
  adminOrSuperAdmin,
  superAdminOnly,
} from "../middleware/authMiddleware.js";

const router = express.Router();

/*
 * ==========================================
 * ALL ADMIN ROUTES
 * ==========================================
 *
 * Both Admin and Superadmin can enter these
 * routes unless a route specifically uses
 * superAdminOnly.
 *
 */

router.use(
  protect,
  adminOrSuperAdmin
);


/*
 * ==========================================
 * USERS / STUDENTS
 * ==========================================
 */


/*
 * Admin + Superadmin
 *
 * Get all users
 */
router.get(
  "/users",
  getUsers
);


/*
 * Admin + Superadmin
 *
 * Update student profile
 */
router.patch(
  "/users/:id",
  updateStudent
);


/*
 * Superadmin only
 *
 * Delete student
 */
router.delete(
  "/users/:id",
  superAdminOnly,
  deleteStudent
);


/*
 * Superadmin only
 *
 * Make student an admin
 */
router.patch(
  "/users/:id/make-admin",
  superAdminOnly,
  makeAdmin
);


/*
 * Superadmin only
 *
 * Remove admin privileges
 */
router.patch(
  "/users/:id/remove-admin",
  superAdminOnly,
  removeAdmin
);


/*
 * ==========================================
 * COMPETITIONS
 * ==========================================
 */


/*
 * Admin + Superadmin
 *
 * View all competitions
 */
router.get(
  "/competitions",
  getCompetitions
);


/*
 * Admin + Superadmin
 *
 * View one competition
 */
router.get(
  "/competitions/:id",
  getCompetition
);


/*
 * ==========================================
 * SUPERADMIN ONLY COMPETITION MANAGEMENT
 * ==========================================
 */


/*
 * Create competition
 */
router.post(
  "/competitions",
  superAdminOnly,
  createCompetition
);


/*
 * Update competition
 */
router.patch(
  "/competitions/:id",
  superAdminOnly,
  updateCompetition
);


/*
 * Delete competition
 */
router.delete(
  "/competitions/:id",
  superAdminOnly,
  deleteCompetition
);


/*
 * Open registration
 */
router.patch(
  "/competitions/:id/open-registration",
  superAdminOnly,
  openRegistration
);


/*
 * Close registration
 */
router.patch(
  "/competitions/:id/close-registration",
  superAdminOnly,
  closeRegistration
);


/*
 * Mark competition as completed
 */
router.patch(
  "/competitions/:id/complete",
  superAdminOnly,
  completeCompetition
);


/*
 * Publish competition results
 */
router.post(
  "/competitions/:id/publish-results",
  superAdminOnly,
  publishCompetitionResults
);


/*
 * ==========================================
 * CERTIFICATES
 * ==========================================
 *
 * Admin + Superadmin
 */


/*
 * Get certificates
 */
router.get(
  "/certificates",
  getCertificates
);


/*
 * Create / upload certificate
 */
router.post(
  "/certificates",
  createCertificate
);


/*
 * Delete certificate
 *
 * Superadmin only
 */
router.delete(
  "/certificates/:id",
  superAdminOnly,
  deleteCertificate
);


export default router;