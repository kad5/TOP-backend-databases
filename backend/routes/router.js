const asyncHandler = require("express-async-handler");
const controller = require("../controllers/controller");
const { Router } = require("express");
const router = Router();

router.get("/", (req, res) => res.send("home"));
router.post("/:id", controller.searchDb);
router.get("/:id/reviews", controller.getReviews);
router.post("/:id/addReview", controller.addReview);
router.post("/:id/:revirew", controller.likeReview);
router.post("/:id/:revirew", controller.dislikeReview);

module.exports = router;
