import express from "express";

import {
  createQuery,
  getQueries,
  getQuery,
  getMyQueries,
  updateQuery,
  deleteQuery,
} from "../controllers/queryController.js";

import {
  protect,
  optionalProtect,
  adminOrSuperAdmin,
  superAdminOnly,
} from "../middleware/authMiddleware.js";

const router = express.Router();


/*
 * ==========================================
 * CREATE QUERY
 *
 * PUBLIC + LOGGED-IN STUDENT
 * ==========================================
 *
 * Before login:
 *     query.user = null
 *
 * After login:
 *     query.user = logged-in user's ID
 *
 */

router.post(
  "/",
  optionalProtect,
  createQuery
);


/*
 * ==========================================
 * STUDENT
 *
 * GET MY QUERIES
 * ==========================================
 *
 * Login required.
 *
 */

router.get(
  "/my",
  protect,
  getMyQueries
);


/*
 * ==========================================
 * ADMIN + SUPERADMIN
 *
 * ALL QUERY ROUTES BELOW THIS POINT
 * REQUIRE ADMIN ACCESS
 * ==========================================
 */

router.use(
  protect,
  adminOrSuperAdmin
);


/*
 * ==========================================
 * GET ALL QUERIES
 * ==========================================
 */

router.get(
  "/",
  getQueries
);


/*
 * ==========================================
 * GET SINGLE QUERY
 * ==========================================
 */

router.get(
  "/:id",
  getQuery
);


/*
 * ==========================================
 * UPDATE QUERY
 *
 * Can update:
 * - status
 * - adminReply
 * ==========================================
 */

router.patch(
  "/:id",
  updateQuery
);


/*
 * ==========================================
 * DELETE QUERY
 *
 * SUPERADMIN ONLY
 * ==========================================
 */

router.delete(
  "/:id",
  superAdminOnly,
  deleteQuery
);


export default router;