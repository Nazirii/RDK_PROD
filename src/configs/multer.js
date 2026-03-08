const multer = require("multer");
const path = require("path");
const fileValidationService = require("../utils/FileValidationService");
const fs = require("fs");

["uploads/gallery", "uploads/articles"].forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

function getUploadDir(req) {
  if (req.baseUrl?.includes("articles") || req.path?.includes("articles")) {
    return "uploads/articles/";
  }
  return "uploads/gallery/";
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, getUploadDir(req));
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const validation = fileValidationService.validateMimeType(file.mimetype);
  if (validation.isValid) {
    cb(null, true);
  } else {
    cb(new Error(validation.error), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB — sama dengan FileValidationService
  fileFilter,
});

module.exports = upload;
