import Content from "./content.model.js";

// ─── GET /api/content ──────────────────────────────────────────────────────────
export const getAll = async (req, res, next) => {
  try {
    const sections = await Content.find({}).sort({ section: 1 });
    res.json({ success: true, data: sections });
  } catch (err) {
    next(err);
  }
};

// ─── GET /api/content/:section ────────────────────────────────────────────────
export const getOne = async (req, res, next) => {
  try {
    const section = await Content.findOne({ section: req.params.section });
    if (!section) {
      return res.status(404).json({ success: false, message: `Section "${req.params.section}" not found` });
    }
    res.json({ success: true, data: section });
  } catch (err) {
    next(err);
  }
};

// ─── PUT /api/content/:section  (protected) ───────────────────────────────────
export const update = async (req, res, next) => {
  try {
    const { en, ar, images } = req.body;

    // Build $set object — only include fields that were sent
    const setFields = {};
    if (en     !== undefined) setFields.en     = en;
    if (ar     !== undefined) setFields.ar     = ar;
    if (images !== undefined) setFields.images = images;

    const updated = await Content.findOneAndUpdate(
      { section: req.params.section },
      { $set: setFields },
      { new: true, runValidators: false }
      // runValidators: false — Mixed fields don't play well with validators on update
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: `Section "${req.params.section}" not found` });
    }

    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};
