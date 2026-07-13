import { Router } from "express";
import { get, update } from "./settings.controller.js";
import authMiddleware from "../../middlewares/auth.middleware.js";

const router = Router();

router.get("/", get);                      // public — website
router.put("/", authMiddleware, update);   // protected — dashboard

export default router;
