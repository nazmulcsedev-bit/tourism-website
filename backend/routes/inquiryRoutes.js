const express = require('express');
const router = express.Router();
const { createInquiry, getInquiries, updateInquiryStatus } = require('../controllers/inquiryController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/', createInquiry);
router.get('/', protect, adminOnly, getInquiries);
router.put('/:id', protect, adminOnly, updateInquiryStatus);

module.exports = router;