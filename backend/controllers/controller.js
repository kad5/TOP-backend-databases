const db = require("../db/queries");
const asyncHandler = require("express-async-handler");
const queries = require("../db/queries");

const loadMain = asyncHandler(async (req, res) => {
  const { featuredRes, featuredCity, citynum } = await db.getMain();
  res.render("main", { featuredRes, featuredCity, citynum });
});

const explore = asyncHandler(async (req, res) => {
  const allCitiesQ = await queries.allCities();
  let allCities = [];
  allCitiesQ.forEach(async (city) => {
    const { resCount, country } = await queries.fetchEach(city);
    allCities.push({ name: city.name, resCount, country });
  });
  res.render("explore_city", { allCities });
});

const searchDb = asyncHandler(async (req, res) => {
  const { searchTerm } = req.body;
  if (!searchTerm) return;
  const response = await queries.searchTables(searchTerm);
  res.render("explore_res", { response });
});

const getRestaurant = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) return;
  const response = await queries.restaurant(id);
  const reviews = getReviews(req, res);
  res.render("restaurant_page", { response, reviews });
});

const getReviews = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) return;
  return await queries.reviews(id);
});

const addReview = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) return;
  const { revName, revBody, rating } = req.body;
  if (!revName || !revBody || !rating) return;

  const data = { id, revName, revBody, rating };
  await queries.addReview(data);
  return res.redirect(`/restaurants/${id}`);
});

const likeReview = asyncHandler(async (req, res) => {
  const { id, review } = req.params;
  if (!id || !review) return;
  await queries.like(review);
  return res.redirect(`/restaurants/${id}`);
});

const dislikeReview = asyncHandler(async (req, res) => {
  const { id, review } = req.params;
  if (!id || !review) return;
  await queries.dislike(review);
  return res.redirect(`/restaurants/${id}`);
});

module.exports = {
  loadMain,
  explore,
  searchDb,
  getRestaurant,
  getReviews,
  addReview,
  likeReview,
  dislikeReview,
};
