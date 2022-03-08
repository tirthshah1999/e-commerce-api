const express = require("express");
const router = express.Router();

const {createReview, getAllReviews, getSingleReview, updateReview, deleteReview} = require('../controllers/reviewController');

const {authenticatedUser} = require("../middleware/authentication");

router.route("/")
.post(authenticatedUser, createReview)
.get(getAllReviews)

router.route("/:id")
.get(getSingleReview)
.patch(authenticatedUser, updateReview)
.delete(authenticatedUser, deleteReview)

module.exports = router;