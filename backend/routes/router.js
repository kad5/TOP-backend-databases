const controller = require("../controllers/controller");
const { Router } = require("express");
const router = Router();

router.get("/", (req, res) => res.send("home"));
router.post("/", controller.searchDb);
router.post("/:id", controller.getRestaurant);
router.get("/:id/reviews", controller.getReviews);
router.post("/:id/addReview", controller.addReview);
router.post("/:id/:revirew/like", controller.likeReview);
router.post("/:id/:revirew/dislike", controller.dislikeReview);

module.exports = router;
