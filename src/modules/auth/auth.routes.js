import { Router } from "express";
import { login, logout, me, forgotPassword, resetPassword } from "./auth.controller.js";
import authMiddleware from "../../middlewares/auth.middleware.js";

const router = Router();

router.post("/login", login);
router.post("/logout", logout);
router.get("/me", authMiddleware, me);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
