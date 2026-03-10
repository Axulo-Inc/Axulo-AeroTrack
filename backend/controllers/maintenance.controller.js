const Maintenance = require('../models/Maintenance');
const Aircraft = require('../models/Aircraft');
const { validationResult } = require('express-validator');

// @desc    Get all maintenance tasks
// @route   GET /api/maintenance
// @access  Private
const getAllMaintenance = async (req, res) => {
  try {
    const { 
      aircraft, 
      status, 
      priority,
      type,
      fromDate,
      toDate,
      limit = 100, 
      page = 1 
    } = req.query;

    // Build filter object
    const filter = {};
    if (aircraft) filter.aircraft = aircraft;
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (type) filter.type = type;
    
    // Date range filter
    if (fromDate || toDate) {
      filter.scheduledDate = {};
      if (fromDate) filter.scheduledDate.$gte = new Date(fromDate);
      if (toDate) filter.scheduledDate.$lte = new Date(toDate);
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const limitNum = parseInt(limit);

    // Execute query with population
    const tasks = await Maintenance.find(filter)
      .populate('aircraft', 'registration type')
      .populate('assignedTo', 'name')
      .populate('createdBy', 'name')
      .populate('parts.part', 'partNumber name')
      .sort({ scheduledDate: 1 })
      .skip(skip)
      .limit(limitNum);

    // Get total count for pagination
    const total = await Maintenance.countDocuments(filter);

    res.json({
      success: true,
      data: tasks,
      pagination: {
        page: parseInt(page),
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Get maintenance error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get maintenance by aircraft
// @route   GET /api/maintenance/aircraft/:aircraftId
// @access  Private
const getMaintenanceByAircraft = async (req, res) => {
  try {
    const tasks = await Maintenance.find({ aircraft: req.params.aircraftId })
      .populate('assignedTo', 'name')
      .populate('parts.part', 'partNumber name')
      .sort({ scheduledDate: -1 });

    res.json({ success: true, data: tasks });
  } catch (error) {
    console.error('Get maintenance by aircraft error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single maintenance task by ID
// @route   GET /api/maintenance/:id
// @access  Private
const getMaintenanceById = async (req, res) => {
  try {
    const task = await Maintenance.findById(req.params.id)
      .populate('aircraft', 'registration type manufacturer')
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name')
      .populate('parts.part', 'partNumber name unitCost');

    if (!task) {
      return res.status(404).json({ message: 'Maintenance task not found' });
    }

    res.json({ success: true, data: task });
  } catch (error) {
    console.error('Get maintenance by ID error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Maintenance task not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create new maintenance task
// @route   POST /api/maintenance
// @access  Private
const createMaintenance = async (req, res) => {
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

    // Create maintenance task
    const task = await Maintenance.create({
      ...req.body,
      aircraftRegistration: aircraft.registration,
      createdBy: req.user._id
    });

    res.status(201).json({ success: true, data: task });
  } catch (error) {
    console.error('Create maintenance error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update maintenance task
// @route   PUT /api/maintenance/:id
// @access  Private
const updateMaintenance = async (req, res) => {
  try {
    let task = await Maintenance.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Maintenance task not found' });
    }

    // If status is being changed to 'Completed', set completed date
    if (req.body.status === 'Completed' && task.status !== 'Completed') {
      req.body.completedDate = new Date();
    }

    // Update task
    task = await Maintenance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({ success: true, data: task });
  } catch (error) {
    console.error('Update maintenance error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Maintenance task not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete maintenance task
// @route   DELETE /api/maintenance/:id
// @access  Private (Admin/Manager)
const deleteMaintenance = async (req, res) => {
  try {
    const task = await Maintenance.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Maintenance task not found' });
    }

    await task.deleteOne();

    res.json({ success: true, message: 'Maintenance task deleted successfully' });
  } catch (error) {
    console.error('Delete maintenance error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Maintenance task not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update maintenance progress
// @route   PATCH /api/maintenance/:id/progress
// @access  Private
const updateProgress = async (req, res) => {
  try {
    const { progress } = req.body;
    
    if (progress < 0 || progress > 100) {
      return res.status(400).json({ message: 'Progress must be between 0 and 100' });
    }

    const task = await Maintenance.findByIdAndUpdate(
      req.params.id,
      { 
        progress,
        ...(progress === 100 ? { status: 'Completed', completedDate: new Date() } : {})
      },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: 'Maintenance task not found' });
    }

    res.json({ success: true, data: task });
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get maintenance statistics
// @route   GET /api/maintenance/stats/summary
// @access  Private
const getMaintenanceStats = async (req, res) => {
  try {
    const total = await Maintenance.countDocuments();
    const scheduled = await Maintenance.countDocuments({ status: 'Scheduled' });
    const inProgress = await Maintenance.countDocuments({ status: 'In Progress' });
    const completed = await Maintenance.countDocuments({ status: 'Completed' });

    // Count by priority
    const byPriority = await Maintenance.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);

    // Count by type
    const byType = await Maintenance.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);

    // Average completion time
    const avgCompletionTime = await Maintenance.aggregate([
      { $match: { 
        status: 'Completed', 
        completedDate: { $exists: true },
        scheduledDate: { $exists: true }
      }},
      {
        $project: {
          daysToComplete: {
            $divide: [
              { $subtract: ['$completedDate', '$scheduledDate'] },
              1000 * 60 * 60 * 24 // Convert to days
            ]
          }
        }
      },
      { $group: { _id: null, avg: { $avg: '$daysToComplete' } } }
    ]);

    res.json({
      success: true,
      data: {
        total,
        scheduled,
        inProgress,
        completed,
        byPriority,
        byType,
        avgCompletionTime: avgCompletionTime[0]?.avg || 0
      }
    });
  } catch (error) {
    console.error('Get maintenance stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllMaintenance,
  getMaintenanceByAircraft,
  getMaintenanceById,
  createMaintenance,
  updateMaintenance,
  deleteMaintenance,
  updateProgress,
  getMaintenanceStats
};
