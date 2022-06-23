const AppError = require("../utils/AppError");

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    return res.status(500).json({
      status: "error",
      message: "Something went very wrong",
    });
  }
};

const sendErrorDev = (err, res) => {
  return res.status(err.statusCode).json({
    error: err,
    stack: err.stack,
    status: err.status,
    message: err.message,
  });
};

const handleDuplicateFieldError = (err) => {
  const value = err.message.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
  const message = `Duplicate field value ${value}. Please provide another value.`;
  return new AppError(message, 400);
};

const handleMongooseValidationError = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const handleTokenExpireError = () => {
  return new AppError("Token has expired", 401);
};
const handleTokenInvalidTokenError = () => {
  return new AppError("Invalid token", 401);
};

module.exports = errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "production") {
    if (err.code === 11000) err = handleDuplicateFieldError(err);
    if (err.name === "ValidationError")
      err = handleMongooseValidationError(err);
    if (err.name === "TokenExpiredError") err = handleTokenExpireError();
    if (err.name === "JsonWebTokenError") err = handleTokenInvalidTokenError();
    sendErrorProd(err, res);
  } else if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  }
};
