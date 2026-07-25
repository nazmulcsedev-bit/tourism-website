const TourPackage = require('../models/TourPackage');

// @desc    Get all tour packages (with optional filters, search, pagination)
// @route   GET /api/tours
// @access  Public
const getTours = async (req, res) => {
  try {
    const { category, location, minPrice, maxPrice, search, featured, page = 1, limit = 12 } = req.query;

    const filter = {};

    if (category) filter.category = category;
    if (location) filter.location = { $regex: location, $options: 'i' };
    if (featured) filter.featured = featured === 'true';
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const tours = await TourPackage.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await TourPackage.countDocuments(filter);

    res.json({
      tours,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single tour package by ID
// @route   GET /api/tours/:id
// @access  Public
const getTourById = async (req, res) => {
  try {
    const tour = await TourPackage.findById(req.params.id);

    if (!tour) {
      return res.status(404).json({ message: 'Tour package not found' });
    }

    res.json(tour);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new tour package
// @route   POST /api/tours
// @access  Private/Admin
const createTour = async (req, res) => {
  try {
    const images = req.files ? req.files.map((file) => `/uploads/${file.filename}`) : [];

    const tourData = {
      ...req.body,
      images,
      createdBy: req.user._id,
    };

    // included/excluded/itinerary may arrive as JSON strings from form-data
    ['included', 'excluded', 'itinerary'].forEach((field) => {
      if (typeof tourData[field] === 'string') {
        try {
          tourData[field] = JSON.parse(tourData[field]);
        } catch {
          // leave as-is if not valid JSON
        }
      }
    });

    const tour = await TourPackage.create(tourData);
    res.status(201).json(tour);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a tour package
// @route   PUT /api/tours/:id
// @access  Private/Admin
const updateTour = async (req, res) => {
  try {
    const tour = await TourPackage.findById(req.params.id);

    if (!tour) {
      return res.status(404).json({ message: 'Tour package not found' });
    }

    const updateData = { ...req.body };

    if (req.files && req.files.length > 0) {
      updateData.images = req.files.map((file) => `/uploads/${file.filename}`);
    }

    ['included', 'excluded', 'itinerary'].forEach((field) => {
      if (typeof updateData[field] === 'string') {
        try {
          updateData[field] = JSON.parse(updateData[field]);
        } catch {
          // leave as-is
        }
      }
    });

    const updatedTour = await TourPackage.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.json(updatedTour);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a tour package
// @route   DELETE /api/tours/:id
// @access  Private/Admin
const deleteTour = async (req, res) => {
  try {
    const tour = await TourPackage.findById(req.params.id);

    if (!tour) {
      return res.status(404).json({ message: 'Tour package not found' });
    }

    await tour.deleteOne();
    res.json({ message: 'Tour package deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getTours, getTourById, createTour, updateTour, deleteTour };