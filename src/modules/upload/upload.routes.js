import { Router } from "express";
import multer from "multer";
import { uploadImage, deleteImage } from "./upload.controller.js";
import authMiddleware from "../../middlewares/auth.middleware.js";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Only JPEG, PNG, WebP, and GIF images are allowed"), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

const router = Router();

router.post(  "/image", authMiddleware, upload.single("image"), uploadImage);
router.delete("/image", authMiddleware, deleteImage);

export default router;
