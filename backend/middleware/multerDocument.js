// backend/middleware/multerDocument.js
const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");

// Define upload directory
const uploadDir = path.join(__dirname, "..", "uploads", "documents");

// Custom Storage Engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // ✅ Create directory if it doesn't exist every time
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
      console.log("✅ Directory created:", uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = uuidv4() + ext;
    cb(null, uniqueName);
  },
});

// Allowed file types
const fileFilter = (req, file, cb) => {
  const allowedMimes = ["application/pdf", "image/jpeg", "image/png"];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF, JPEG, and PNG files are allowed"), false);
  }
};

// Limits (5 MB max)
const limits = { fileSize: 5 * 1024 * 1024 }; // 5 MB

// Multer instance
const upload = multer({ storage, fileFilter, limits });

// Export middlewares
exports.uploadSingle = upload.single("file");
exports.uploadMultiple = upload.array("file", 6);
