const SSLCommerzPayment = require('sslcommerz-lts');
const Booking = require('../models/Booking');
const sendEmail = require('../utils/sendEmail');
const { statusUpdateTemplate } = require('../utils/emailTemplates');

const store_id = process.env.SSLCZ_STORE_ID;
const store_passwd = process.env.SSLCZ_STORE_PASSWORD;
const is_live = process.env.SSLCZ_IS_LIVE === 'true';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// @desc    Initialize a payment session for a booking, returns SSLCommerz gateway URL
// @route   POST /api/payments/init/:bookingId
// @access  Private (owner of the booking)
const initPayment = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId).populate('tour', 'title');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized for this booking' });
    }
    if (booking.paymentStatus === 'paid') {
      return res.status(400).json({ message: 'This booking is already paid' });
    }

    // tran_id must be unique per attempt — combine booking id + timestamp
    const tran_id = `${booking._id}-${Date.now()}`;
    booking.transactionId = tran_id;
    await booking.save();

    const data = {
      total_amount: booking.totalPrice,
      currency: 'BDT',
      tran_id,
      success_url: `${BACKEND_URL}/api/payments/success`,
      fail_url: `${BACKEND_URL}/api/payments/fail`,
      cancel_url: `${BACKEND_URL}/api/payments/cancel`,
      ipn_url: `${BACKEND_URL}/api/payments/ipn`,
      shipping_method: 'N/A',
      product_name: booking.tour?.title || 'Tour Package',
      product_category: 'Tourism',
      product_profile: 'general',
      cus_name: booking.fullName,
      cus_email: booking.email,
      cus_add1: booking.tour?.location || 'Dhaka',
      cus_city: 'Dhaka',
      cus_postcode: '1000',
      cus_country: 'Bangladesh',
      cus_phone: booking.phone,
      shipping_method: 'NO',
      num_of_item: booking.numberOfPeople,
      value_a: booking._id.toString(), // custom field to identify booking on callback
    };

    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    const apiResponse = await sslcz.init(data);

    if (apiResponse?.GatewayPageURL) {
      res.json({ url: apiResponse.GatewayPageURL });
    } else {
      res.status(500).json({ message: 'Failed to initialize payment gateway', details: apiResponse });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper — marks a booking as paid & confirmed, then emails the user
const markBookingPaid = async (bookingId) => {
  const booking = await Booking.findById(bookingId).populate('tour', 'title location');
  if (!booking || booking.paymentStatus === 'paid') return booking;

  booking.paymentStatus = 'paid';
  booking.status = 'confirmed';
  await booking.save();

  sendEmail({
    to: booking.email,
    subject: 'পেমেন্ট সফল হয়েছে — Bhromon',
    html: statusUpdateTemplate(booking, booking.tour),
  });

  return booking;
};

// @desc    SSLCommerz redirects here (POST) after a successful payment
// @route   POST /api/payments/success
// @access  Public (called by SSLCommerz)
const paymentSuccess = async (req, res) => {
  try {
    const { val_id, value_a: bookingId } = req.body;

    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    const validation = await sslcz.validate({ val_id });

    if (validation.status === 'VALID' || validation.status === 'VALIDATED') {
      await markBookingPaid(bookingId);
      return res.redirect(`${FRONTEND_URL}/payment/success?bookingId=${bookingId}`);
    }

    return res.redirect(`${FRONTEND_URL}/payment/fail?bookingId=${bookingId}`);
  } catch (error) {
    console.error('Payment validation error:', error.message);
    return res.redirect(`${FRONTEND_URL}/payment/fail`);
  }
};

// @desc    SSLCommerz redirects here (POST) if payment fails
// @route   POST /api/payments/fail
// @access  Public
const paymentFail = (req, res) => {
  const bookingId = req.body.value_a;
  res.redirect(`${FRONTEND_URL}/payment/fail?bookingId=${bookingId || ''}`);
};

// @desc    SSLCommerz redirects here (POST) if user cancels
// @route   POST /api/payments/cancel
// @access  Public
const paymentCancel = (req, res) => {
  const bookingId = req.body.value_a;
  res.redirect(`${FRONTEND_URL}/payment/cancel?bookingId=${bookingId || ''}`);
};

// @desc    Server-to-server Instant Payment Notification — backup confirmation
// @route   POST /api/payments/ipn
// @access  Public (called by SSLCommerz servers)
const paymentIPN = async (req, res) => {
  try {
    const { val_id, value_a: bookingId } = req.body;
    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    const validation = await sslcz.validate({ val_id });

    if (validation.status === 'VALID' || validation.status === 'VALIDATED') {
      await markBookingPaid(bookingId);
    }
    res.status(200).send('IPN received');
  } catch (error) {
    console.error('IPN error:', error.message);
    res.status(500).send('IPN processing failed');
  }
};

module.exports = { initPayment, paymentSuccess, paymentFail, paymentCancel, paymentIPN };