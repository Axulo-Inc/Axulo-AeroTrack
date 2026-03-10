const Defect = require('../models/Defect');
const Aircraft = require('../models/Aircraft');
const { validationResult } = require('express-validator');

// @desc    Get all defects
// @route   GET /api/defects
// @access  Private
const getAllDefects = async (req, res) => {
  try {
    const { 
      aircraft, 
      status, 
      severity, 
      category,
      fromDate,
      toDate,
      limit = 100, 
      page = 1 
    } = req.query;

    // Build filter object
    const filter = {};
    if (aircraft) filter.aircraft = aircraft;
    if (status) filter.status = status;
    if (severity) filter.severity = severity;
    if (category) filter.category = category;
    
    // Date range filter
    if (fromDate || toDate) {
      filter.reportedDate = {};
      if (fromDate) filter.reportedDate.$gte = new Date(fromDate);
      if (toDate) filter.reportedDate.$lte = new Date(toDate);
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const limitNum = parseInt(limit);

    // Execute query with population
    const defects = await Defect.find(filter)
      .populate('aircraft', 'registration type')
      .populate('reportedBy', 'name')
      .populate('assignedTo', 'name')
      .sort({ reportedDate: -1 })
      .skip(skip)
      .limit(limitNum);

    // Get total count for pagination
    const total = await Defect.countDocuments(filter);

    res.json({
      success: true,
      data: defects,
      pagination: {
        page: parseInt(page),
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Get defects error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get defects by aircraft
// @route   GET /api/defects/aircraft/:aircraftId
// @access  Private
const getDefectsByAircraft = async (req, res) => {
  try {
    const defects = await Defect.find({ aircraft: req.params.aircraftId })
      .populate('reportedBy', 'name')
      .populate('assignedTo', 'name')
      .sort({ reportedDate: -1 });

    res.json({ success: true, data: defects });
  } catch (error) {
    console.error('Get defects by aircraft error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single defect by ID
// @route   GET /api/defects/:id
// @access  Private
const getDefectById = async (req, res) => {
  try {
    const defect = await Defect.findById(req.params.id)
      .populate('aircraft', 'registration type manufacturer')
      .populate('reportedBy', 'name email')
      .populate('assignedTo', 'name email')
      .populate('attachments.uploadedBy', 'name');

    if (!defect) {
      return res.status(404).json({ message: 'Defect not found' });
    }

    res.json({ success: true, data: defect });
  } catch (error) {
    console.error('Get defect by ID error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Defect not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create new defect
// @route   POST /api/defects
// @access  Private
const createDefect = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Verify aircraft exists
    const aircraft = await Aircraft.findById(req.body.aircraft);
    if (!aircraft) {
      return res.status(404).json({ message: 'Aircraft not found' });
    }

    // Create defect
    const defect = await Defect.create({
      ...req.body,
      aircraftRegistration: aircraft.registration,
      reportedBy: req.user._id,
      reportedDate: new Date()
    });

    res.status(201).json({ success: true, data: defect });
  } catch (error) {
    console.error('Create defect error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update defect
// @route   PUT /api/defects/:id
// @access  Private
const updateDefect = async (req, res) => {
  try {
    let defect = await Defect.findById(req.params.id);

    if (!defect) {
      return res.status(404).json({ message: 'Defect not found' });
    }

    // If status is being changed to 'Closed', set resolved date
    if (req.body.status === 'Closed' && defect.status !== 'Closed') {
      req.body.resolvedDate = new Date();
    }

    // Update defect
    defect = await Defect.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({ success: true, data: defect });
  } catch (error) {
    console.error('Update defect error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Defect not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete defect
// @route   DELETE /api/defects/:id
// @access  Private (Admin/Manager)
const deleteDefect = async (req, res) => {
  try {
    const defect = await Defect.findById(req.params.id);

    if (!defect) {
      return res.status(404).json({ message: 'Defect not found' });
    }

    await defect.deleteOne();

    res.json({ success: true, message: 'Defect deleted successfully' });
  } catch (error) {
    console.error('Delete defect error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Defect not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get defect statistics
// @route   GET /api/defects/stats/summary
// @access  Private
const getDefectStats = async (req, res) => {
  try {
    const total = await Defect.countDocuments();
    const open = await Defect.countDocuments({ status: 'Open' });
    const inProgress = await Defect.countDocuments({ status: 'In Progress' });
    const closed = await Defect.countDocuments({ status: 'Closed' });

    // Count by severity
    const bySeverity = await Defect.aggregate([
      { $group: { _id: '$severity', count: { $sum: 1 } } }
    ]);

    // Count by category
    const byCategory = await Defect.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    // Average downtime
    const avgDowntime = await Defect.aggregate([
      { $match: { downtime: { $gt: 0 } } },
      { $group: { _id: null, avg: { $avg: '$downtime' } } }
    ]);

    // Defects over time (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const overTime = await Defect.aggregate([
      { $match: { reportedDate: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$reportedDate' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      success: true,
      data: {
        total,
        open,
        inProgress,
        closed,
        bySeverity,
        byCategory,
        avgDowntime: avgDowntime[0]?.avg || 0,
        overTime
      }
    });
  } catch (error) {
    console.error('Get defect stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllDefects,
  getDefectsByAircraft,
  getDefectById,
  createDefect,
  updateDefect,
  deleteDefect,
  getDefectStats
};
