import Settings from "./settings.model.js";

const DEFAULTS = {
  brandName:    "Valley Seeds",
  primaryColor: "#037338",
  accentColor:  "#96C422",
  email:        "info@valley-seeds.com",
  phone:        "+20 128 763 6986",
  whatsapp:     "+20 128 763 6986",
  website:      "www.valley-seeds.com",
  location:     "Cairo, Egypt",
  socialLinks: { facebook: "", linkedin: "", instagram: "", whatsapp: "https://wa.me/201287636986" },
  logoUrl:      "",
  logoWhiteUrl: "",
};

// ─── GET /api/settings ─────────────────────────────────────────────────────────
export const get = async (req, res, next) => {
  try {
    const settings = await Settings.findOne({});
    res.json({ success: true, data: settings || DEFAULTS });
  } catch (err) {
    next(err);
  }
};

// ─── PUT /api/settings  (protected) ────────────────────────────────────────────
export const update = async (req, res, next) => {
  try {
    const updated = await Settings.findOneAndUpdate(
      {},
      { $set: req.body },
      { new: true, upsert: true, runValidators: false }
    );
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};
