const Order = require("../models/Order");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

exports.createOrder = catchAsync(async (req, res, next) => {
  const newOrder = new Order({
    orderItems: req.body.orderItems.map((x) => {
      return { ...x, product: x._id };
    }),
    shippingAddress: req.body.shippingAddress,
    paymentMethod: req.body.paymentMethod,
    itemsPrice: req.body.itemsPrice,
    shippingPrice: req.body.shippingPrice,
    taxPrice: req.body.taxPrice,
    totalPrice: req.body.totalPrice,
    user: req.user._id,
  });

  const order = await newOrder.save();

  res.status(201).json({
    status: "success",
    data: {
      order,
    },
  });
});

exports.getAllOrder = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.userId)
    filter = {
      user: req.params.userId,
    };
  const orders = await Order.find(filter).populate("user");

  res.status(200).json({
    status: "success",
    results: orders.length,
    data: {
      orders,
    },
  });
});

exports.getOneOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new AppError("No order found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      order,
    },
  });
});

exports.editAfterPay = catchAsync(async (req, res, next) => {
  const order = Order.findById(req.params.id);
  if (!order) {
    return next(new AppError("No Order found", 404));
  }

  order.isPaid = true;
  order.paidAt = Date.now();
  order.paymentResult = {
    id: req.body.id,
    status: req.body.status,
    update_time: req.body.update_time,
    email_address: req.body.email_address,
  };

  const updatedOrder = await order.save();
  res.status(200).json({ status: "success", order: updatedOrder });
});

exports.deleteOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  await order.remove();
  console.log(order);
  res.status(200).json({
    status: "success",
    data: {
      order,
    },
  });
});
