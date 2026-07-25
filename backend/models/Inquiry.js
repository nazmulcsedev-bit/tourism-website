const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
    subject: { type: String, trim: true, default: 'General Inquiry' },
    message: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ['new', 'responded', 'closed'],
      default: 'new',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Inquiry', inquirySchema);