const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
} = require('../controllers/bookingController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// All booking routes require login
router.post('/', protect, createBooking);
router.get('/my-bookings', protect, getMyBookings);
router.get('/', protect, adminOnly, getAllBookings);
router.get('/:id', protect, getBookingById);
router.put('/:id', protect, adminOnly, updateBookingStatus);
router.put('/:id/cancel', protect, cancelBooking);

module.exports = router;