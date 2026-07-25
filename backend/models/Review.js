const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
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
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: [true, 'Review comment is required'],
      trim: true,
      maxlength: 1000,
    },
  },
  { timestamps: true }
);

// একজন user একটা ট্যুরে শুধু একবারই review দিতে পারবে
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);