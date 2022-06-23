const Product = require("../models/Product");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const APIFeatures = require("../utils/Features");

exports.getAllProducts = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Product.find(), req.query).filter();
  // .sort()
  // .limitFields()
  // .paginate();

  const products = await features.query;

  res.status(200).json({
    status: "success",
    results: products.length,
    data: {
      products,
    },
  });
});

exports.getOneProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findOne({ slug: req.params.slug });

  if (!product) {
    return next(new AppError("No product found with that slug"));
  }
  res.status(200).json({
    status: "success",
    data: {
      product,
    },
  });
});

exports.getOneProductById = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new AppError("No product found", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      product,
    },
  });
});

exports.updateProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new AppError("No Product found", 404));
  }

  product.name = req.body.name;
  product.price = req.body.price;
  product.image = req.body.image;
  product.category = req.body.category;
  product.brand = req.body.brand;
  product.countInStock = req.body.countInStock;
  product.description = req.body.description;

  const updatedProduct = await product.save();
  console.log(updatedProduct);

  res.status(200).json({
    status: "success",
    data: {
      product: updatedProduct,
    },
  });
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  await product.remove();
  res.status(200).json({ status: "success", data: { product } });
});

exports.createProduct = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const product = await Product.create(req.body);

  res.status(200).json({ status: "success", data: { product } });
});

exports.getCategories = catchAsync(async (req, res, next) => {
  const categories = await Product.find().distinct("category");
  res.status(200).json({ status: "success", data: { categories } });
});
