const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const requireAuth = require("../middleware/auth");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 15 * 1024 * 1024 } });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function uploadToCloudinary(buffer, resourceType) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "keyhold", resource_type: resourceType },
      (error, result) => (error ? reject(error) : resolve(result))
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
}

// Single endpoint for both inspection photos and lease PDFs.
// The client sends `type=image` or `type=raw` (for PDFs) as a query param.
router.post("/", requireAuth, upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded." });
  }
  try {
    const resourceType = req.query.type === "raw" ? "raw" : "image";
    const result = await uploadToCloudinary(req.file.buffer, resourceType);
    res.json({ url: result.secure_url });
  } catch (err) {
    res.status(500).json({ error: "Upload failed." });
  }
});

module.exports = router;
