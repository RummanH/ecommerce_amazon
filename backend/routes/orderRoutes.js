const express = require("express");
const { protect, restrictTo } = require("../controllers/authController");
const {
  createOrder,
  getOneOrder,
  editAfterPay,
  getAllOrder,
  deleteOrder,
} = require("../controllers/orderController");
const router = express.Router({
  mergeParams: true,
});

router
  .route("/")
  .post(protect, restrictTo("user"), createOrder)
  .get(protect, getAllOrder);
router
  .route("/:id")
  .get(protect, getOneOrder)
  .delete(protect, restrictTo("admin"), deleteOrder);
router.route("/:id/pay").put(protect, editAfterPay);

module.exports = router;
