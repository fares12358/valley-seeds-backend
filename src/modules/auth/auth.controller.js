import crypto from "crypto";
import jwt from "jsonwebtoken";
import Admin from "./auth.model.js";
import { sendPasswordResetEmail, sendPasswordResetConfirmation } from "../../config/email.js";

// Cookie options — centralised so logout uses identical settings
const cookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
});

// ─── POST /api/auth/login ─────────────────────────────────────────────────────
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (!admin || !(await admin.comparePassword(password))) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    res.cookie("vs_token", token, cookieOptions());
    res.json({
      success: true,
      data: { email: admin.email, createdAt: admin.createdAt },
    });
  } catch (err) {
    next(err);
  }
};

// ─── POST /api/auth/logout ────────────────────────────────────────────────────
export const logout = (req, res) => {
  res.clearCookie("vs_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
  });
  res.json({ success: true, data: null });
};

// ─── GET /api/auth/me ─────────────────────────────────────────────────────────
export const me = (req, res) => {
  // req.admin set by authMiddleware — already stripped of sensitive fields
  res.json({ success: true, data: req.admin });
};

// ─── POST /api/auth/forgot-password ──────────────────────────────────────────
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });

    // Always return success — prevents email enumeration
    if (!admin) {
      return res.json({ success: true, data: null });
    }

    // Generate raw token (sent in URL) and store only the hash
    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

    admin.resetToken = hashedToken;
    admin.resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await admin.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.CLIENT_URL}/dashboard/reset-password?token=${rawToken}`;
    await sendPasswordResetEmail(admin.email, resetUrl);

    res.json({ success: true, data: null });
  } catch (err) {
    next(err);
  }
};

// ─── POST /api/auth/reset-password ───────────────────────────────────────────
export const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ success: false, message: "Token and new password are required" });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
    }

    // Hash the incoming raw token and compare to stored hash
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const admin = await Admin.findOne({
      resetToken: hashedToken,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!admin) {
      return res.status(400).json({ success: false, message: "Reset link is invalid or has expired" });
    }

    // Update password (pre-save hook hashes it)
    admin.password = newPassword;
    admin.resetToken = undefined;
    admin.resetTokenExpiry = undefined;
    await admin.save();

    // Send confirmation email (non-blocking — don't fail if this errors)
    sendPasswordResetConfirmation(admin.email).catch((err) =>
      console.warn("[auth] Confirmation email failed:", err.message)
    );

    res.json({ success: true, data: null });
  } catch (err) {
    next(err);
  }
};
