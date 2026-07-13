import Settings from "./settings.model.js";

// NOTE: These defaults must stay in sync with SettingsSchema in settings.model.js.
// Future: extract to a shared constants file to eliminate duplication.
const DEFAULTS = {
  brandName:         "Valley Seeds",
  primaryColor:      "#037338",
  accentColor:       "#96C422",
  email:             "info@valley-seeds.com",
  phone:             "+20 128 763 6986",
  whatsapp:          "+20 128 763 6986",
  website:           "www.valley-seeds.com",
  location:          "Cairo, Egypt",
  socialLinks:       { facebook: "", linkedin: "", instagram: "", whatsapp: "https://wa.me/201287636986" },
  logoUrl:           "",
  logoWhiteUrl:      "",
  logoPublicId:      "",
  logoWhitePublicId: "",
};

// Explicit field whitelist — never let raw req.body bleed into $set
const ALLOWED_FIELDS = [
  "brandName", "primaryColor", "accentColor",
  "email", "phone", "whatsapp", "website", "location",
  "socialLinks",
  "logoUrl", "logoWhiteUrl",
  "logoPublicId", "logoWhitePublicId",
];

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
    // Only allow known fields — reject anything outside the whitelist
    const payload = {};
    ALLOWED_FIELDS.forEach((key) => {
      if (req.body[key] !== undefined) payload[key] = req.body[key];
    });

    // Whitelist nested socialLinks keys too
    if (payload.socialLinks) {
      const { facebook, linkedin, instagram, whatsapp } = payload.socialLinks;
      payload.socialLinks = { facebook, linkedin, instagram, whatsapp };
    }

    const updated = await Settings.findOneAndUpdate(
      {},
      { $set: payload },
      { new: true, upsert: true, runValidators: false }
    );
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};
