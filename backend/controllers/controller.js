//const db = require("../db/queries");
const asyncHandler = require("express-async-handler");
const db = require("../db/db.js");

const searchDb = asyncHandler(async (req, res) => {
  const { searchTerm } = req.body;
  if (!searchTerm) return;

  const searchArray = db.tempList.find((arr) => arr.includes(searchTerm));
  if (!searchArray) return;

  if (searchArray[2] === "city") res.send("you searched for a city");
  if (searchArray[2] === "country") res.send("you searched for a country");
});

const getReviews = asyncHandler(async (req, res) => {
  const { restaurant } = req.params;
  if (!restaurant) return;
  res.send("all reviews");
});

const addReview = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { revName, revBody, rating } = req.body;
  if (!revName || !revBody || !rating) return;
  res.send("review added");
});

const likeReview = asyncHandler(async (req, res) => {
  const { id, revirew } = req.params;
  if (!id || !revirew) return;
  res.send(`liked`);
});

const dislikeReview = asyncHandler(async (req, res) => {
  const { id, revirew } = req.params;
  if (!id || !revirew) return;
  res.send(`disliked`);
});

module.exports = { searchDb, getReviews, addReview, likeReview, dislikeReview };
