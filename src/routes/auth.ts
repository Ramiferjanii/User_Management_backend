import express from "express";
import { login, signup, refreshToken, getMe, passwordReset, emailVerification } from "../controllers/authController";
import { authenticate } from "../middleware/auth";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/refresh", refreshToken);
router.post("/password-reset", passwordReset);
router.post("/verify-email", emailVerification);
router.get("/me", authenticate, getMe);

export default router;
