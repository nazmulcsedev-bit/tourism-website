const express = require('express');
const router = express.Router();
const {
  getTourReviews,
  createReview,
  deleteReview,
  checkEligibility,
  getFeaturedReviews,
} = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.get('/featured', getFeaturedReviews);
router.get('/tour/:tourId', getTourReviews);
router.get('/eligibility/:tourId', protect, checkEligibility);
router.post('/', protect, createReview);
router.delete('/:id', protect, deleteReview);

module.exports = router;