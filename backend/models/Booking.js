const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    tour: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TourPackage',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
    },
    numberOfPeople: {
      type: Number,
      required: true,
      min: 1,
    },
    travelDate: {
      type: Date,
      required: [true, 'Travel date is required'],
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    specialRequests: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'paid', 'refunded'],
      default: 'unpaid',
    },
    transactionId: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);