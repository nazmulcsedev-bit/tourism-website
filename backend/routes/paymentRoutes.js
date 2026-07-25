const express = require('express');
const router = express.Router();
const {
  initPayment,
  paymentSuccess,
  paymentFail,
  paymentCancel,
  paymentIPN,
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

// Logged-in user starts a payment for their own booking
router.post('/init/:bookingId', protect, initPayment);

// SSLCommerz calls these directly (POST, form-encoded) — must stay public
router.post('/success', paymentSuccess);
router.post('/fail', paymentFail);
router.post('/cancel', paymentCancel);
router.post('/ipn', paymentIPN);

module.exports = router;