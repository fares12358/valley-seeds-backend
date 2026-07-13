import { Router } from "express";
import { submit, getAll, markRead, remove } from "./contact.controller.js";
import authMiddleware from "../../middlewares/auth.middleware.js";

const router = Router();

router.post(  "/",             submit);                    // public — website form
router.get(   "/messages",     authMiddleware, getAll);    // protected — dashboard
router.patch( "/messages/:id", authMiddleware, markRead);  // protected — dashboard
router.delete("/messages/:id", authMiddleware, remove);    // protected — dashboard

export default router;
