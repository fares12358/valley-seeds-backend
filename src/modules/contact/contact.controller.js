import Contact from "./contact.model.js";
import { sendContactEmail } from "../../config/email.js";

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || ""));

// ─── POST /api/contact  (public) ─────────────────────────────────────────────
export const submit = async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Required field check — return 400 with a single clear message
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and message are required",
      });
    }

    // Email format check
    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address",
      });
    }

    // Message length — must be at least 5 chars (reasonable minimum, not 10)
    if (message.trim().length < 5) {
      return res.status(400).json({
        success: false,
        message: "Message is too short",
      });
    }

    const contact = await Contact.create({
      name:    name.trim(),
      email:   email.trim().toLowerCase(),
      phone:   phone?.trim()   || undefined,
      subject: subject?.trim() || undefined,
      message: message.trim(),
    });

    // Fire-and-forget email — wrapped so ANY error (sync or async) is swallowed
    // and never causes the contact submission to fail
    try {
      sendContactEmail(contact).catch((err) =>
        console.warn("[contact] Email send failed:", err.message)
      );
    } catch (emailErr) {
      console.warn("[contact] Email init failed:", emailErr.message);
    }

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

    // Single aggregation replaces 3 sequential queries
    const [result] = await Contact.aggregate([
      {
        $facet: {
          messages: [
            { $match: filter },
            { $sort: { createdAt: -1 } },
          ],
          totals: [
            {
              $group: {
                _id:         null,
                total:       { $sum: 1 },
                unreadCount: { $sum: { $cond: [{ $eq: ["$read", false] }, 1, 0] } },
              },
            },
          ],
        },
      },
    ]);

    const messages    = result?.messages              || [];
    const total       = result?.totals?.[0]?.total       || 0;
    const unreadCount = result?.totals?.[0]?.unreadCount || 0;

    res.json({ success: true, data: { messages, total, unreadCount } });
  } catch (err) {
    next(err);
  }
};

// ─── PATCH /api/contact/messages/:id  (protected) ────────────────────────────
export const markRead = async (req, res, next) => {
  try {
    const readValue = req.body.read ?? true;

    const updated = await Contact.findByIdAndUpdate(
      req.params.id,
      { read: readValue },
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
