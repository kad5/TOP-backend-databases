const controller = require("../controllers/controller");
const { Router } = require("express");
const router = Router();
const path = require("path");

router.get("/", controller.loadMain);
router.post("/", controller.searchDb);
router.post("/explore", controller.explore);
router.get("/:id", controller.getRestaurant);
router.get("/:id/reviews", controller.getReviews);
router.post("/:id/addReview", controller.addReview);
router.post("/:id/:revirew/like", controller.likeReview);
router.post("/:id/:revirew/dislike", controller.dislikeReview);

module.exports = router;
