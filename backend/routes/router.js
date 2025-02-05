const controller = require("../controllers/controller");
const { Router } = require("express");
const router = Router();
const path = require("path");

router.get("/", controller.loadMain);
router.post("/search", controller.searchDb);
router.get("/explore", controller.exploreCities);
router.get("/city/:id", controller.city);
router.get("/restaurant/:id", controller.getRestaurant);
router.get("/restaurant/:id/reviews", controller.getReviews);
router.post("/restaurant/:id/addReview", controller.addReview);
router.post("/restaurant/:id/:revirew/like", controller.likeReview);
router.post("/restaurant/:id/:revirew/dislike", controller.dislikeReview);

module.exports = router;
