const multer = require("multer");
const express = require("express");
const AppError = require("../utils/AppError");
const sharp = require("sharp");

const { protect } = require("../controllers/authController");
const { memoryStorage } = require("multer");

const router = express.Router();

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads");
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split("/")[1];
//     cb(null, `user-${req.user._id}-${Date.now()}.${ext}`);
//   },
// });

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image. Please upload image file", 400), false);
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

router.post(
  "/",
  protect,
  upload.single("image"),
  (req, res, next) => {
    req.file.filename = `uploads/user-${req.user._id}-${Date.now()}.jpeg`;
    sharp(req.file.buffer)
      .resize(500, 500, { fit: "fill", position: "right top" })
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`${req.file.filename}`);
    next();
  },
  (req, res) => {
    res
      .status(200)
      .json({ status: "success", data: { image: `/${req.file.filename}` } });
  }
);

module.exports = router;
