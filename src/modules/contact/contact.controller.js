import Contact from "./contact.model.js";
import { sendContactEmail } from "../../config/email.js";

// ─── POST /api/contact  (public) ─────────────────────────────────────────────
export const submit = async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and message are required",
      });
    }

    const contact = await Contact.create({ name, email, phone, subject, message });

    // Send email — wrapped so a mail failure never fails the submission
    sendContactEmail(contact).catch((err) =>
      console.warn("[contact] Email send failed:", err.message)
    );

    res.status(201).json({ success: true, data: null });
  } catch (err) {
    next(err);
  }
};

// ─── GET /api/contact/messages  (protected) ───────────────────────────────────
export const getAll = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.read !== undefined) {
      filter.read = req.query.read === "true";
    }

    const messages    = await Contact.find(filter).sort({ createdAt: -1 });
    const total       = await Contact.countDocuments({});
    const unreadCount = await Contact.countDocuments({ read: false });

    res.json({ success: true, data: { messages, total, unreadCount } });
  } catch (err) {
    next(err);
  }
};

// ─── PATCH /api/contact/messages/:id  (protected) ────────────────────────────
export const markRead = async (req, res, next) => {
  try {
    const updated = await Contact.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ success: false, message: "Message not found" });
    }
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

// ─── DELETE /api/contact/messages/:id  (protected) ───────────────────────────
export const remove = async (req, res, next) => {
  try {
    const deleted = await Contact.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Message not found" });
    }
    res.json({ success: true, data: null });
  } catch (err) {
    next(err);
  }
};
