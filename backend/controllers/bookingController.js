const Booking = require('../models/Booking');
const TourPackage = require('../models/TourPackage');
const sendEmail = require('../utils/sendEmail');
const { bookingConfirmationTemplate, adminNewBookingTemplate, statusUpdateTemplate } = require('../utils/emailTemplates');

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private (logged-in users)
const createBooking = async (req, res) => {
  try {
    const { tourId, fullName, email, phone, numberOfPeople, travelDate, specialRequests } = req.body;

    if (!tourId || !fullName || !email || !phone || !numberOfPeople || !travelDate) {
      return res.status(400).json({ message: 'Please provide all required booking fields' });
    }

    const tour = await TourPackage.findById(tourId);
    if (!tour) {
      return res.status(404).json({ message: 'Tour package not found' });
    }

    const totalPrice = tour.price * Number(numberOfPeople);

    const booking = await Booking.create({
      tour: tourId,
      user: req.user._id,
      fullName,
      email,
      phone,
      numberOfPeople,
      travelDate,
      totalPrice,
      specialRequests,
    });

    const populatedBooking = await booking.populate('tour', 'title location price images');

    // Fire-and-forget emails — don't block the response on email delivery
    sendEmail({
      to: booking.email,
      subject: 'আপনার বুকিং request পাওয়া গেছে — Bhromon',
      html: bookingConfirmationTemplate(booking, tour),
    });
    if (process.env.ADMIN_EMAIL) {
      sendEmail({
        to: process.env.ADMIN_EMAIL,
        subject: `নতুন বুকিং: ${tour.title}`,
        html: adminNewBookingTemplate(booking, tour),
      });
    }

    res.status(201).json(populatedBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged-in user's own bookings
// @route   GET /api/bookings/my-bookings
// @access  Private
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('tour', 'title location price images duration')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all bookings (admin)
// @route   GET /api/bookings
// @access  Private/Admin
const getAllBookings = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (status) filter.status = status;

    const skip = (Number(page) - 1) * Number(limit);

    const bookings = await Booking.find(filter)
      .populate('tour', 'title location price')
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Booking.countDocuments(filter);

    res.json({
      bookings,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single booking by ID
// @route   GET /api/bookings/:id
// @access  Private (owner or admin)
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('tour', 'title location price images duration')
      .populate('user', 'name email');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Only the booking owner or an admin can view it
    const isOwner = booking.user._id.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this booking' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update booking status / payment status (admin)
// @route   PUT /api/bookings/:id
// @access  Private/Admin
const updateBookingStatus = async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;

    const booking = await Booking.findById(req.params.id).populate('tour', 'title location');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const statusChanged = status && status !== booking.status;

    if (status) booking.status = status;
    if (paymentStatus) booking.paymentStatus = paymentStatus;

    await booking.save();

    if (statusChanged && ['confirmed', 'cancelled', 'completed'].includes(booking.status)) {
      sendEmail({
        to: booking.email,
        subject: `আপনার বুকিং স্ট্যাটাস আপডেট — Bhromon`,
        html: statusUpdateTemplate(booking, booking.tour),
      });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel own booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private (owner)
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.json({ message: 'Booking cancelled successfully', booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
};