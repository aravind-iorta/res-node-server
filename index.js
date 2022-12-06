const express = require("express");
const mongoose = require("mongoose");
const User = require("./router/User");
const Restaurant = require("./router/Restaurant");
const cors = require("cors");

const app = express();
app.use(cors({ origin: "*" }));
mongoose.connect("mongodb://localhost:27017/res-app");
app.use(express.json({ limit: "50mb" }));

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});
app.use("/user", User);
app.use("/restaurants", Restaurant);
app.listen(3000, () => {
  console.log("Server is running at port 3000");
});
