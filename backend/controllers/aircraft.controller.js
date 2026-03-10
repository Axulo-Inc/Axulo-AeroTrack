const Aircraft = require('../models/Aircraft');
const { validationResult } = require('express-validator');

// @desc    Get all aircraft
// @route   GET /api/aircraft
// @access  Private
const getAllAircraft = async (req, res) => {
  try {
    const { status, type, search, limit = 100, page = 1 } = req.query;

    // Build filter object
    const filter = {};
    if (status) filter.status = status;
    if (type) filter.type = type;

    // Text search
    if (search) {
      filter.$or = [
        { registration: { $regex: search, $options: 'i' } },
        { type: { $regex: search, $options: 'i' } },
        { manufacturer: { $regex: search, $options: 'i' } }
      ];
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const limitNum = parseInt(limit);

    // Execute query
    const aircraft = await Aircraft.find(filter)
      .sort({ registration: 1 })
      .skip(skip)
      .limit(limitNum);

    // Get total count for pagination
    const total = await Aircraft.countDocuments(filter);

    res.json({
      success: true,
      data: aircraft,
      pagination: {
        page: parseInt(page),
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Get aircraft error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single aircraft by ID
// @route   GET /api/aircraft/:id
// @access  Private
const getAircraftById = async (req, res) => {
  try {
    const aircraft = await Aircraft.findById(req.params.id);

    if (!aircraft) {
      return res.status(404).json({ message: 'Aircraft not found' });
    }

    res.json({ success: true, data: aircraft });
  } catch (error) {
    console.error('Get aircraft by ID error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Aircraft not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create new aircraft
// @route   POST /api/aircraft
// @access  Private (Admin/Manager)
const createAircraft = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if registration already exists
    const existingAircraft = await Aircraft.findOne({ 
      registration: req.body.registration.toUpperCase() 
    });
    
    if (existingAircraft) {
      return res.status(400).json({ 
        message: 'Aircraft with this registration already exists' 
      });
    }

    // Create aircraft
    const aircraft = await Aircraft.create({
      ...req.body,
      registration: req.body.registration.toUpperCase()
    });

    res.status(201).json({ success: true, data: aircraft });
  } catch (error) {
    console.error('Create aircraft error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update aircraft
// @route   PUT /api/aircraft/:id
// @access  Private (Admin/Manager)
const updateAircraft = async (req, res) => {
  try {
    let aircraft = await Aircraft.findById(req.params.id);

    if (!aircraft) {
      return res.status(404).json({ message: 'Aircraft not found' });
    }

    // If registration is being updated, check for duplicates
    if (req.body.registration && req.body.registration !== aircraft.registration) {
      const existingAircraft = await Aircraft.findOne({ 
        registration: req.body.registration.toUpperCase() 
      });
      
      if (existingAircraft) {
        return res.status(400).json({ 
          message: 'Aircraft with this registration already exists' 
        });
      }
    }

    // Update aircraft
    aircraft = await Aircraft.findByIdAndUpdate(
      req.params.id,
      { ...req.body, registration: req.body.registration?.toUpperCase() },
      { new: true, runValidators: true }
    );

    res.json({ success: true, data: aircraft });
  } catch (error) {
    console.error('Update aircraft error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Aircraft not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete aircraft
// @route   DELETE /api/aircraft/:id
// @access  Private (Admin only)
const deleteAircraft = async (req, res) => {
  try {
    const aircraft = await Aircraft.findById(req.params.id);

    if (!aircraft) {
      return res.status(404).json({ message: 'Aircraft not found' });
    }

    // Check if aircraft has associated defects or maintenance
    const Defect = require('../models/Defect');
    const Maintenance = require('../models/Maintenance');

    const hasDefects = await Defect.exists({ aircraft: req.params.id });
    const hasMaintenance = await Maintenance.exists({ aircraft: req.params.id });

    if (hasDefects || hasMaintenance) {
      return res.status(400).json({ 
        message: 'Cannot delete aircraft with existing defects or maintenance records' 
      });
    }

    await aircraft.deleteOne();

    res.json({ success: true, message: 'Aircraft deleted successfully' });
  } catch (error) {
    console.error('Delete aircraft error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Aircraft not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get aircraft statistics
// @route   GET /api/aircraft/stats/summary
// @access  Private
const getAircraftStats = async (req, res) => {
  try {
    const total = await Aircraft.countDocuments();
    const active = await Aircraft.countDocuments({ status: 'Active' });
    const maintenance = await Aircraft.countDocuments({ status: 'Maintenance' });
    const grounded = await Aircraft.countDocuments({ status: 'Ground' });
    
    // Get total hours
    const hoursResult = await Aircraft.aggregate([
      { $group: { _id: null, totalHours: { $sum: '$hours' } } }
    ]);
    const totalHours = hoursResult[0]?.totalHours || 0;

    // Get counts by type
    const byType = await Aircraft.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        total,
        active,
        maintenance,
        grounded,
        totalHours,
        byType
      }
    });
  } catch (error) {
    console.error('Get aircraft stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllAircraft,
  getAircraftById,
  createAircraft,
  updateAircraft,
  deleteAircraft,
  getAircraftStats
};
