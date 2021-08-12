import express from "express";
import cors from "cors";
import sequelize from "sequelize";
import { Restaurant, Review, User } from "./models/models.js"

const app = express();
// 別ポートからのアクセスを許可
app.use(cors());

app.get("/restaurants", async (req, res) => {
  const limit = +req.query.limit || 5;
  const offset = +req.query.offset || 0;
  const restaurants = await Restaurant.findAndCountAll({
    attributes: {
      include: [
        [
          sequelize.literal(
            `(SELECT COUNT(*) FROM reviews AS r WHERE r.restaurant_id = restaurant.id)`,
          ),
          "reviews_count",
        ]
      ],
    },
    include: { model: Review, limit: 3, include: { model: User }},
    order: [[sequelize.literal("reviews_count"), "DESC"]],
    limit,
    offset,
  });
  res.json(restaurants);
});

app.get("/restaurants/:restaurantsId", async (req, res) => {
  const restaurantId = +req.query.restaurantId;
  const restaurant = await Restaurant.findByPK(restaurantId);
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
  const restaurant = await Restaurant.findByPK(restaurantId);
  if (!restaurant) {
    res.status(404).send("not found");
    return;
  }
  const reviews = await Review.findAndCountAll({
    include: { mpdel: User },
    where: { restaurantId },
    limit,
    offset,
  });
  res.json(reviews);
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});