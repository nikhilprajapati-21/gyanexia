import { Router } from "express";
import rateLimit from "express-rate-limit";
import { getMe, login, logout, register } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { message: "Too many authentication attempts. Please try again in 15 minutes." },
});

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.post("/logout", logout);
router.get("/me", protect, getMe);

export default router;
