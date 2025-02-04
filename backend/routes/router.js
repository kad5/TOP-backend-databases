const asyncHandler = require("express-async-handler");
const controller = require("../controllers/controller");
const { Router } = require("express");
const router = Router();

router.get("/", (req, res) => res.send("home"));
router.post("/:id", (req, res) => res.send("location page from search"));
router.get("/:id/reviews", (req, res) => res.send("all reviews"));
router.post("/:id/addReview", (req, res) => res.send("review added"));
router.post("/:id/:revirewLiked", (req, res) => res.send("review liked"));
router.post("/:id/:revirewDisliked", (req, res) => res.send("review disliked"));

module.exports = router;
