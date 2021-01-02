const express = require('express');
const {
  getAllReviews,
  getSingleReview,
  addReview
} = require('../controllers/reviews');

const Review = require('../models/Review');

const router = express.Router({ mergeParams: true });

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(
    advancedResults(Review, {
      path: 'bootcamp',
      select: 'name description'
    }),
    getAllReviews
  )
  .post(protect, authorize('user', 'admin'), addReview);

router.route('/:id')
    .get(getSingleReview)

module.exports = router;