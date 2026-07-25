const mongoose = require('mongoose');

const tourPackageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Tour title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0,
    },
    duration: {
      type: String, // e.g. "3 Days 2 Nights"
      required: [true, 'Duration is required'],
    },
    maxGroupSize: {
      type: Number,
      default: 10,
    },
    images: [
      {
        type: String, // file paths / URLs
      },
    ],
    category: {
      type: String,
      enum: ['Beach', 'Mountain', 'Historical', 'Adventure', 'City', 'Village', 'Other'],
      default: 'Other',
    },
    included: [String], // e.g. ["Hotel", "Breakfast", "Transport"]
    excluded: [String], // e.g. ["Lunch", "Personal Expenses"]
    itinerary: [
      {
        day: Number,
        title: String,
        description: String,
      },
    ],
    ratingsAverage: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    ratingsCount: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('TourPackage', tourPackageSchema);