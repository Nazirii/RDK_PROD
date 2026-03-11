const express = require("express");
const router = express.Router();
const galleryController = require("../controllers/galleryController");
const upload = require("../configs/multer");

// CREATE a new gallery record (multipart/form-data, field gambar: 'images')
router.post(
  "/galleries",
  verifyToken,
  isAdmin,
  upload.array("images"),
  galleryController.createGallery,
);

// GET all gallery records
router.get("/galleries", galleryController.getAllGalleries);

// GET a single gallery record by ID
router.get("/galleries/:id", galleryController.getGalleryById);

// GET satu gambar dari gallery sebagai binary (index berbasis 0)
router.get("/galleries/:id/image/:index", galleryController.getGalleryImage);

// UPDATE a gallery record by ID (images opsional)
router.put(
  "/galleries/:id",
  verifyToken,
  isAdmin,
  upload.array("images"),
  galleryController.updateGallery,
);

// ADD images to an existing gallery (append)
router.post(
  "/galleries/:id/images",
  verifyToken,
  isAdmin,
  upload.array("images"),
  galleryController.addImages,
);

// DELETE a single image from a gallery by index
router.delete(
  "/galleries/:id/images/:index",
  verifyToken,
  isAdmin,
  galleryController.deleteImage,
);

// DELETE a gallery record by ID
router.delete(
  "/galleries/:id",
  verifyToken,
  isAdmin,
  galleryController.deleteGallery,
);

module.exports = router;
