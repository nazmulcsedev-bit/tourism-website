const Inquiry = require('../models/Inquiry');
const sendEmail = require('../utils/sendEmail');

// @desc    Submit a contact form inquiry
// @route   POST /api/inquiries
// @access  Public
const createInquiry = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'নাম, ইমেইল ও মেসেজ আবশ্যক' });
    }

    const inquiry = await Inquiry.create({ name, email, phone, subject, message });

    if (process.env.ADMIN_EMAIL) {
      sendEmail({
        to: process.env.ADMIN_EMAIL,
        subject: `নতুন Inquiry: ${subject || 'General Inquiry'}`,
        html: `
          <div style="font-family: Arial, sans-serif; padding:20px;">
            <h2 style="color:#12463D;">নতুন যোগাযোগ বার্তা</h2>
            <p><strong>নাম:</strong> ${name}</p>
            <p><strong>ইমেইল:</strong> ${email}</p>
            <p><strong>ফোন:</strong> ${phone || 'দেওয়া হয়নি'}</p>
            <p><strong>বিষয়:</strong> ${subject || 'General Inquiry'}</p>
            <p><strong>মেসেজ:</strong></p>
            <p style="background:#F1E7D3; padding:12px; border-radius:8px;">${message}</p>
          </div>
        `,
      });
    }

    res.status(201).json({ message: 'আপনার বার্তা পাঠানো হয়েছে। আমরা শীঘ্রই যোগাযোগ করব।', inquiry });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all inquiries (admin)
// @route   GET /api/inquiries
// @access  Private/Admin
const getInquiries = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const inquiries = await Inquiry.find(filter).sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update inquiry status (admin)
// @route   PUT /api/inquiries/:id
// @access  Private/Admin
const updateInquiryStatus = async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }
    inquiry.status = req.body.status || inquiry.status;
    await inquiry.save();
    res.json(inquiry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createInquiry, getInquiries, updateInquiryStatus };