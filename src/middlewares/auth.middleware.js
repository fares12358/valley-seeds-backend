import jwt from "jsonwebtoken";
import Admin from "../modules/auth/auth.model.js";

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies?.vs_token;
    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized — no token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id).select("-password -resetToken -resetTokenExpiry");

    if (!admin) {
      return res.status(401).json({ success: false, message: "Unauthorized — admin not found" });
    }

    req.admin = admin;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Unauthorized — invalid token" });
  }
};

export default authMiddleware;
