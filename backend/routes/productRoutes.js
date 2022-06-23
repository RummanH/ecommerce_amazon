const express = require("express");

const {
  getAllProducts,
  getOneProduct,
  getCategories,
  getOneProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const { protect, restrictTo } = require("../controllers/authController");

const router = express.Router();

router.route("/categories").get(getCategories);
router
  .route("/")
  .get(getAllProducts)
  .post(protect, restrictTo("admin"), createProduct);
router.route("/slug/:slug").get(getOneProduct);
router
  .route("/:id")
  .get(protect, getOneProductById)
  .patch(protect, restrictTo("admin"), updateProduct)
  .delete(protect, restrictTo("admin"), deleteProduct);

module.exports = router;
