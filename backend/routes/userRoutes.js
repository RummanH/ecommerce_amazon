const express = require("express");
const orderRouter = require("../routes/orderRoutes");

const { signup, login, protect } = require("../controllers/authController");

const { updateMe } = require("../controllers/userController");

const router = express.Router();

router.use("/:userId/orders", orderRouter);

//---------------------auth------------------

router.route("/signup").post(signup);
router.route("/login").post(login);

//---------------------- user ---------------

router.route("/updateMe").patch(protect, updateMe);

module.exports = router;
