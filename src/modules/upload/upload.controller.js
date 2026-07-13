import cloudinary from "../../config/cloudinary.js";

// Helper — wrap upload_stream in a Promise
const uploadToCloudinary = (buffer, options) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
    stream.end(buffer);
  });

// ─── POST /api/upload/image  (protected) ──────────────────────────────────────
export const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No image file provided" });
    }

    const folder = req.query.folder || "general";

    const result = await uploadToCloudinary(req.file.buffer, {
      folder:        `valley-seeds/${folder}`,
      resource_type: "image",
      quality:       "auto",
      fetch_format:  "auto",
    });

    res.json({
      success: true,
      data: {
        url:      result.secure_url,
        publicId: result.public_id,
      },
    });
  } catch (err) {
    next(err);
  }
};

// ─── DELETE /api/upload/image  (protected) ────────────────────────────────────
export const deleteImage = async (req, res, next) => {
  try {
    const { publicId } = req.body;
    if (!publicId) {
      return res.status(400).json({ success: false, message: "publicId is required" });
    }

    await cloudinary.uploader.destroy(publicId);
    res.json({ success: true, data: null });
  } catch (err) {
    next(err);
  }
};
