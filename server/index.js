import express from "express";
import cors from "cors";
import * as data from "./sample-data.js";

const app = express();
// 別ポートからのアクセスを許可
app.use(cors());

app.get("/restaurants", async (req, res) => {
  const limit = +req.query.limit || 5;
  const offset = +req.query.offset || 0;
  const restaurants = data.restaurants;
  res.json({
    rows: restaurants.slice(offset, offset + limit),
    count: data.restaurants.length,
  });
});

app.get("/restaurants/:restaurantsId", async (req, res) => {
  const restaurantId = +req.query.restaurantId;
  const restaurant = data.restaurants.find(
    (restaurant) => restaurant.id === restaurantId
  );
  if (!restaurant) {
    res.status(404).send("not found");
    return;
  }
  res.json(restaurant);
});

app.get("/restaurants/:restaurantsId/reviews", async (req, res) => {
  const restaurantId = req.query.restaurantId;
  const limit = req.query.limit || 5;
  const offset = req.query.offset || 0;
  const restaurant = data.restaurants.find(
    (restaurant) => restaurant.id === restaurantId
  );
  if (!restaurant) {
    res.status(404).send("not found");
    return;
  }
  const reviews = data.reviews.filter(
    (reviews) => reviews.restaurantId === restaurantId
  );
  res.json({
    count: reviews.length,
    rows: reviews.slice(offset, offset + limit),
  });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});