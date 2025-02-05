const db = require("../db/queries");
const asyncHandler = require("express-async-handler");
const queries = require("../db/queries");

const loadMain = asyncHandler(async (req, res) => {
  const { featuredRes, featuredCity, resCount, citynum } = await db.getMain();
  res.render("main", { featuredRes, featuredCity, resCount, citynum });
});

const exploreCities = asyncHandler(async (req, res) => {
  const allCitiesQ = await queries.getAll();
  const allCities = await Promise.all(
    allCitiesQ.map(async (city) => {
      const { resCount, country } = await queries.fetchEach(city);
      return { id: city.id, name: city.name, resCount, country };
    })
  );
  res.render("explore_city", { allCities });
});

const city = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { cityName } = req.query;
  const cityData = await queries.cityById(id);
  const allres = await Promise.all(
    cityData.map(async (rest) => {
      const restaurant = await queries.restaurant(rest.id);
      return {
        id: restaurant.id,
        name: restaurant.name,
        location: restaurant.location,
        food_category: restaurant.food_category,
        overall_stars: restaurant.overall_stars,
      };
    })
  );
  const response = {
    id,
    type: "city",
    name: cityName,
    restaurants: allres,
  };
  res.render("explore_res", { response });
});

const searchDb = asyncHandler(async (req, res) => {
  console.log("here");
  const { searchTerm } = req.body;
  if (!searchTerm) return;
  const response = await queries.searchTables(searchTerm);
  if (response === null) res.render("no_data");
  res.render("explore_res", { response });
});

const getRestaurant = asyncHandler(async (req, res) => {
  let { id } = req.params;
  id = Number(id);
  if (!id) res.send("error");
  const response = await queries.restaurant(id);
  const reviews = await getReviews(id);
  res.render("restaurant_page", { response, reviews });
});

const getReviews = asyncHandler(async (id) => {
  if (!id) return;
  const reviews = await queries.reviews(id);
  if (reviews === null) return [];
  return reviews;
});

const addReview = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) return;
  const { revName, revBody, rating } = req.body;
  if (!revName || !revBody || !rating) return;

  const data = { id, revName, revBody, rating };
  await queries.addReview(data);
  return res.redirect(`/restaurant/${id}`);
});

const likeReview = asyncHandler(async (req, res) => {
  const { id, review } = req.params;
  if (!id || !review) return;
  await queries.like(review);
  return res.redirect(`/restaurant/${id}`);
});

const dislikeReview = asyncHandler(async (req, res) => {
  const { id, review } = req.params;
  if (!id || !review) return;
  await queries.dislike(review);
  return res.redirect(`/restaurant/${id}`);
});

module.exports = {
  loadMain,
  exploreCities,
  city,
  searchDb,
  getRestaurant,
  getReviews,
  addReview,
  likeReview,
  dislikeReview,
};
