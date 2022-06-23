const path = require("path");

const express = require("express");
const cors = require("cors");

const globalErrorHandler = require("./controllers/errorController");
const AppError = require("./utils/AppError");

const productRouter = require("./routes/productRoutes");
const userRouter = require("./routes/userRoutes");
const orderRouter = require("./routes/orderRoutes");
const uploadRouter = require("./routes/uploadRoutes");

const app = express();
app.use(cors());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.static(path.join(__dirname, ".", "public")));

app.get("/api/keys/paypal", (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      clientID: process.env.PAYPAL_CLIENT_ID,
    },
  });
});

app.use("/api/v1/upload", uploadRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/orders", orderRouter);

const dirname = path.resolve();
app.use("/uploads", express.static(path.join(dirname, "/uploads")));

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, ".", "public", "index.html"));
});

app.use(globalErrorHandler);

module.exports = app;
