const express = require("express");
const restaurantModel = require("../model/Restaurant");
const app = express();

app.post("/:id", async (request, response) => {
  const restaurant = new restaurantModel({
    ...request.body,
    user: request.params.id,
  });
  try {
    await restaurant.save();
    response.status(201).json({ msg: "created restaurant successfully" });
  } catch (error) {
    response.status(500).send(error);
  }
});

app.get("/all/:id", async (request, response) => {
  let perPage = request.query.perPage;
  let page = request.query.page;
  let name = request.query.name;
  let search = name ? { name: { $regex: name, $options: "i" } } : {};
  try {
    const restaurants = await restaurantModel
      .find({
        isActive: true,
        user: request.params.id,
        ...search,
      })
      .limit(perPage * 1)
      .skip((page - 1) * perPage)
      // .populate("user")
      .exec();
    const count = await restaurantModel.countDocuments({
      isActive: true,
    });
    response.status(200).json({
      data: restaurants,
      totalPages: Math.ceil(count / perPage),
      currentPage: page,
    });
  } catch (error) {
    response.status(500).send(error);
  }
});

app.get("/:id", async (request, response) => {
  const restaurants = await restaurantModel.findById(request.params.id);
  try {
    response.send(restaurants);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.delete("/:id", async (request, response) => {
  const id = request.params.id;
  const restaurants = await restaurantModel.findByIdAndUpdate(id, {
    isActive: false,
  });
  try {
    response.send(restaurants);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.put("/:id", async (request, response) => {
  const id = request.params.id;
  const restaurants = await restaurantModel.findByIdAndUpdate(id, request.body);
  try {
    response.send(restaurants);
  } catch (error) {
    response.status(500).send(error);
  }
});

module.exports = app;
