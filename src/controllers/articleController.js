const path = require("path");
const fs = require("fs");
const Article = require("../models/articleModel");
const Category = require("../models/categoryModel");

// CREATE a new article (image opsional via multipart/form-data, field: 'image')
exports.createArticle = async (req, res) => {
  try {
    const {
      title,
      content,
      summary,
      status,
      categoryId,
      publishedDate,
      writer,
    } = req.body;

    // Validate that the referenced category exists
    const categoryExists = await Category.exists({ _id: categoryId });
    if (!categoryExists) {
      return res.status(400).json({
        success: false,
        message: "Category not found. Provide a valid categoryId.",
      });
    }

    let image = null;
    if (req.file) {
      image = {
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        fileExtension: path.extname(req.file.originalname),
        fileSize: req.file.size,
        filePath: '/' + req.file.path.replace(/\\/g, '/'),
      };
    }

    const newArticle = new Article({
      title,
      content,
      summary,
      status,
      category: categoryId,
      publishedDate,
      writer,
      image,
    });
    const savedArticle = await newArticle.save();
    await savedArticle.populate("category", "name");
    res.status(201).json({ success: true, data: savedArticle });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating article",
      error: error.message,
    });
  }
};

// GET all articles
exports.getAllArticles = async (req, res) => {
  try {
    const articles = await Article.find().populate(
      "category",
      "name",
    );
    if (articles.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No articles found" });
    }
    res.status(200).json({ success: true, data: articles });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching articles",
      error: error.message,
    });
  }
};

// GET a single article by ID
exports.getArticleById = async (req, res) => {
  try {
    const { id } = req.params;
    const article = await Article.findById(id).populate("category", "name");
    if (!article) {
      return res
        .status(404)
        .json({ success: false, message: "Article not found" });
    }
    res.status(200).json({ success: true, data: article });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching article",
      error: error.message,
    });
  }
};

// GET article image as binary — untuk verifikasi hasil upload
exports.getArticleImage = async (req, res) => {
  try {
    const { id } = req.params;
    const article = await Article.findById(id);
    if (!article) {
      return res
        .status(404)
        .json({ success: false, message: "Article not found" });
    }
    if (!article.image) {
      return res
        .status(404)
        .json({ success: false, message: "Article has no image" });
    }
    const absolutePath = path.resolve(article.image.filePath);
    if (!fs.existsSync(absolutePath)) {
      return res.status(404).json({ success: false, message: "File tidak ditemukan di server" });
    }
    res.set("Content-Type", article.image.mimeType);
    res.set("Content-Disposition", `inline; filename="${article.image.originalName}"`);
    res.sendFile(absolutePath);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving article image",
      error: error.message,
    });
  }
};

// UPDATE an article by ID (image opsional — jika tidak dikirim, image lama tetap tersimpan)
exports.updateArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      content,
      summary,
      status,
      categoryId,
      publishedDate,
      writer,
    } = req.body;

    // Validate category if a new one is being set
    if (categoryId !== undefined) {
      const categoryExists = await Category.exists({ _id: categoryId });
      if (!categoryExists) {
        return res.status(400).json({
          success: false,
          message: "Category not found. Provide a valid categoryId.",
        });
      }
    }

    const updateData = {
      title,
      content,
      summary,
      status,
      publishedDate,
      writer,
    };
    if (categoryId !== undefined) updateData.category = categoryId;
    if (req.file) {
      // Hapus file lama dari disk
      const oldArticle = await Article.findById(id);
      if (oldArticle && oldArticle.image && oldArticle.image.filePath) {
        const oldPath = path.resolve(oldArticle.image.filePath);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      updateData.image = {
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        fileExtension: path.extname(req.file.originalname),
        fileSize: req.file.size,
        filePath: '/' + req.file.path.replace(/\\/g, '/'),
      };
    }

    const updatedArticle = await Article.findByIdAndUpdate(id, updateData, {
      new: true,
    }).populate("category", "name");
    if (!updatedArticle) {
      return res
        .status(404)
        .json({ success: false, message: "Article not found" });
    }
    res.status(200).json({ success: true, data: updatedArticle });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating article",
      error: error.message,
    });
  }
};

// DELETE an article by ID
exports.deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const article = await Article.findById(id);
    if (!article) {
      return res
        .status(404)
        .json({ success: false, message: "Article not found" });
    }
    // Hapus file dari disk
    if (article.image && article.image.filePath) {
      const absPath = path.resolve(article.image.filePath);
      if (fs.existsSync(absPath)) fs.unlinkSync(absPath);
    }
    await Article.findByIdAndDelete(id);
    res
      .status(200)
      .json({ success: true, message: "Article deleted successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting article",
      error: error.message,
    });
  }
};
