const express = require("express");
const userModel = require("../model/User");
const app = express();

app.post("/register", async (request, response) => {
  const user = new userModel(request.body);
  try {
    await user.save();
    response.status(201).json({ msg: "register successfully" });
  } catch (error) {
    response.status(500).send(error);
  }
});

app.post("/login", async (request, response) => {
  const user = await userModel.findOne({ email: request.body.email });
  try {
    if (user?.password == request.body.password) {
      response
        .status(200)
        .json({
          msg: "Login successfully",
          data: { ...user._doc, password: null },
        });
    } else {
      response.status(401).json({ msg: "email or password is not valid" });
    }
  } catch (error) {
    response.status(500).send(error);
  }
});

app.get("/", async (request, response) => {
  const users = await userModel.find({});
  try {
    response.send(users);
  } catch (error) {
    response.status(500).send(error);
  }
});

module.exports = app;
