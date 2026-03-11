require("dotenv").config();
const express = require("express");
const path = require("path");
const port = process.env.PORT || 5000;
const app = express();
const connectDB = require("./configs/db");
const mongoose = require("mongoose");
const articleRoutes = require("./routes/articleRoute");
const categoryRoutes = require("./routes/categoryRoute");
const donationRoutes = require("./routes/donationRoutes");
const galleryRoutes = require("./routes/galleryRoutes");
const authRoutes = require("../src/routes/authRoutes");

process.env.TZ = "Asia/Jakarta";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use(articleRoutes);
app.use(categoryRoutes);
app.use(donationRoutes);
app.use(galleryRoutes);
app.use(authRoutes);

const multer = require("multer");
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "Ukuran file melebihi batas maksimal 5MB.",
      });
    }
    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({
        success: false,
        message: `Field gambar tidak dikenal: '${err.field}'. Periksa nama field yang digunakan di Postman.`,
      });
    }
    return res.status(400).json({ success: false, message: err.message });
  }
  if (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
  next();
});

process.on("SIGINT", async () => {
  try {
    await mongoose.connection.close();
    console.log("🔌 MongoDB connection closed due to app termination");
  } catch (err) {
    console.error("❌ Error closing MongoDB connection:", err);
  }
  process.exit(0);
});

(async () => {
  const dbConnected = await connectDB();
  if (!dbConnected) {
    console.error("❌ Server not started due to database connection failure");
    process.exit(1);
  }
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
})();
