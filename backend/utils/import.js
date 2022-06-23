const mongoose = require("mongoose");
const Product = require("../models/Product");

require("dotenv").config({ path: "../config.env" });

const { products } = require("../data");

const importData = async () => {
  try {
    await Product.create(products);
    console.log("Data imported successfully");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await Product.deleteMany();
    console.log("Data deleted successfully");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Database is connected successfully"));
