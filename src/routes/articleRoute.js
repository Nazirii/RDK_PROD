const express = require("express");
const router = express.Router();
const articleController = require("../controllers/articleController");
const upload = require("../configs/multer");
const verifyToken = require("../middlewares/authMiddleware");
const isAdmin = require("../middlewares/adminMiddleware");

// CREATE a new article (multipart/form-data, field gambar: 'image')
router.post(
  "/articles",
  upload.single("image"),
  verifyToken,
  isAdmin,
  articleController.createArticle,
);

// GET all articles
router.get("/articles", articleController.getAllArticles);

// GET a single article by ID
router.get("/articles/:id", articleController.getArticleById);

// GET article image as binary (untuk verifikasi hasil upload)
router.get("/articles/:id/image", articleController.getArticleImage);

// UPDATE an article by ID (image optional)
router.put(
  "/articles/:id",
  verifyToken,
  isAdmin,
  upload.single("image"),
  articleController.updateArticle,
);

// DELETE an article by ID
router.delete(
  "/articles/:id",
  verifyToken,
  isAdmin,
  articleController.deleteArticle,
);

module.exports = router;
