const express = require('express');
const router = express.Router();
const {
  getTours,
  getTourById,
  createTour,
  updateTour,
  deleteTour,
} = require('../controllers/tourController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public routes
router.get('/', getTours);
router.get('/:id', getTourById);

// Admin-only routes (protected + admin check + image upload, max 5 images)
router.post('/', protect, adminOnly, upload.array('images', 5), createTour);
router.put('/:id', protect, adminOnly, upload.array('images', 5), updateTour);
router.delete('/:id', protect, adminOnly, deleteTour);

module.exports = router;