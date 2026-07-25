const Review = require('../models/Review');
const TourPackage = require('../models/TourPackage');
const Booking = require('../models/Booking');

// Recalculates and saves a tour's average rating + review count
const recalculateTourRating = async (tourId) => {
  const stats = await Review.aggregate([
    { $match: { tour: tourId } },
    { $group: { _id: '$tour', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);

  await TourPackage.findByIdAndUpdate(tourId, {
    ratingsAverage: stats.length > 0 ? Math.round(stats[0].avgRating * 10) / 10 : 0,
    ratingsCount: stats.length > 0 ? stats[0].count : 0,
  });
};

// @desc    Get all reviews for a tour
// @route   GET /api/reviews/tour/:tourId
// @access  Public
const getTourReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ tour: req.params.tourId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a review for a tour
// @route   POST /api/reviews
// @access  Private (must be logged in; must have a confirmed/completed booking for this tour)
const createReview = async (req, res) => {
  try {
    const { tourId, rating, comment } = req.body;

    if (!tourId || !rating || !comment) {
      return res.status(400).json({ message: 'Tour, rating, and comment are required' });
    }

    const tour = await TourPackage.findById(tourId);
    if (!tour) {
      return res.status(404).json({ message: 'Tour package not found' });
    }

    // শুধু যারা এই ট্যুর বুক করেছে (confirmed/completed) তারাই review দিতে পারবে
    const hasBooked = await Booking.findOne({
      tour: tourId,
      user: req.user._id,
      status: { $in: ['confirmed', 'completed'] },
    });

    if (!hasBooked) {
      return res.status(403).json({
        message: 'এই ট্যুর সম্পর্কে review দিতে হলে আগে বুকিং করতে হবে এবং তা নিশ্চিত হতে হবে',
      });
    }

    const existing = await Review.findOne({ tour: tourId, user: req.user._id });
    if (existing) {
      return res.status(400).json({ message: 'আপনি ইতিমধ্যে এই ট্যুরের জন্য review দিয়েছেন' });
    }

    const review = await Review.create({
      tour: tourId,
      user: req.user._id,
      rating,
      comment,
    });

    await recalculateTourRating(tourId);

    const populated = await review.populate('user', 'name');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private (owner or admin)
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    const isOwner = review.user.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    const tourId = review.tour;
    await review.deleteOne();
    await recalculateTourRating(tourId);

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Check if the logged-in user is eligible to review a tour (booked + not already reviewed)
// @route   GET /api/reviews/eligibility/:tourId
// @access  Private
const checkEligibility = async (req, res) => {
  try {
    const hasBooked = await Booking.findOne({
      tour: req.params.tourId,
      user: req.user._id,
      status: { $in: ['confirmed', 'completed'] },
    });
    const alreadyReviewed = await Review.findOne({ tour: req.params.tourId, user: req.user._id });

    res.json({
      canReview: Boolean(hasBooked) && !alreadyReviewed,
      alreadyReviewed: Boolean(alreadyReviewed),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get top-rated recent reviews across all tours (for home page testimonials)
// @route   GET /api/reviews/featured
// @access  Public
const getFeaturedReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ rating: { $gte: 4 } })
      .populate('user', 'name')
      .populate('tour', 'title location')
      .sort({ createdAt: -1 })
      .limit(6);
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getTourReviews, createReview, deleteReview, checkEligibility, getFeaturedReviews };