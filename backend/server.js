const http = require("http");
const fs = require("fs");

const mongoose = require("mongoose");

process.on("uncaughtException", (err) => {
  console.log(err);
  console.log(err.message);
  console.log("UncaughtException. ✨ App is shutting down ");
  process.exit(1);
});

require("dotenv").config();
const app = require("./app");
const connect = require("./db-connect");

const server = http.createServer(app);

mongoose.connection.on("error", (err) => {
  console.log("There was an error App is Shutting down...🤦‍♀️🤦‍♀️🤦‍♀️🤦‍♀️");
  server.close(() => process.exit());
});
mongoose.connection.once("open", () => {
  console.log("MongoDB connected successfully");
});

const port = process.env.PORT || 5000;

const startServer = async () => {
  await connect(process.env.MONGO_URI);
  server.listen(port, () => {
    console.log(`App is listening on port : ${port}`);
  });
};

startServer();

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("Unhandled Rejection ✨ app is shutting down");
  server.close(() => process.exit(0));
});
