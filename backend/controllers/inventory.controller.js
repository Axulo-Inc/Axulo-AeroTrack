const Inventory = require('../models/Inventory');
const { validationResult } = require('express-validator');

// @desc    Get all inventory items
// @route   GET /api/inventory
// @access  Private
const getAllInventory = async (req, res) => {
  try {
    const { 
      category,
      status,
      supplier,
      lowStock,
      search,
      limit = 100, 
      page = 1 
    } = req.query;

    // Build filter object
    const filter = {};
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (supplier) filter.supplier = { $regex: supplier, $options: 'i' };
    
    // Low stock filter
    if (lowStock === 'true') {
      filter.$expr = { $lte: ['$stock', '$minRequired'] };
    }

    // Text search
    if (search) {
      filter.$or = [
        { partNumber: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const limitNum = parseInt(limit);

    // Execute query
    const items = await Inventory.find(filter)
      .sort({ partNumber: 1 })
      .skip(skip)
      .limit(limitNum);

    // Get total count for pagination
    const total = await Inventory.countDocuments(filter);

    res.json({
      success: true,
      data: items,
      pagination: {
        page: parseInt(page),
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Get inventory error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single inventory item by ID
// @route   GET /api/inventory/:id
// @access  Private
const getInventoryById = async (req, res) => {
  try {
    const item = await Inventory.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }

    res.json({ success: true, data: item });
  } catch (error) {
    console.error('Get inventory by ID error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Inventory item not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get inventory by part number
// @route   GET /api/inventory/part/:partNumber
// @access  Private
const getInventoryByPartNumber = async (req, res) => {
  try {
    const item = await Inventory.findOne({ 
      partNumber: req.params.partNumber.toUpperCase() 
    });

    if (!item) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }

    res.json({ success: true, data: item });
  } catch (error) {
    console.error('Get inventory by part number error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create new inventory item
// @route   POST /api/inventory
// @access  Private (Admin/Manager)
const createInventory = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if part number already exists
    const existingItem = await Inventory.findOne({ 
      partNumber: req.body.partNumber.toUpperCase() 
    });
    
    if (existingItem) {
      return res.status(400).json({ 
        message: 'Part number already exists' 
      });
    }

    // Create inventory item
    const item = await Inventory.create({
      ...req.body,
      partNumber: req.body.partNumber.toUpperCase()
    });

    res.status(201).json({ success: true, data: item });
  } catch (error) {
    console.error('Create inventory error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update inventory item
// @route   PUT /api/inventory/:id
// @access  Private (Admin/Manager)
const updateInventory = async (req, res) => {
  try {
    let item = await Inventory.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }

    // If part number is being updated, check for duplicates
    if (req.body.partNumber && req.body.partNumber.toUpperCase() !== item.partNumber) {
      const existingItem = await Inventory.findOne({ 
        partNumber: req.body.partNumber.toUpperCase() 
      });
      
      if (existingItem) {
        return res.status(400).json({ 
          message: 'Part number already exists' 
        });
      }
    }

    // Update item
    item = await Inventory.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        partNumber: req.body.partNumber?.toUpperCase()
      },
      { new: true, runValidators: true }
    );

    res.json({ success: true, data: item });
  } catch (error) {
    console.error('Update inventory error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Inventory item not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update stock level
// @route   PATCH /api/inventory/:id/stock
// @access  Private
const updateStock = async (req, res) => {
  try {
    const { quantity, operation = 'set' } = req.body;

    const item = await Inventory.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }

    // Update stock based on operation
    switch (operation) {
      case 'set':
        item.stock = quantity;
        break;
      case 'add':
        item.stock += quantity;
        break;
      case 'subtract':
        item.stock -= quantity;
        if (item.stock < 0) item.stock = 0;
        break;
      default:
        return res.status(400).json({ message: 'Invalid operation' });
    }

    // Update last used date if subtracting
    if (operation === 'subtract') {
      item.lastUsed = new Date();
    }

    await item.save();

    res.json({ success: true, data: item });
  } catch (error) {
    console.error('Update stock error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete inventory item
// @route   DELETE /api/inventory/:id
// @access  Private (Admin only)
const deleteInventory = async (req, res) => {
  try {
    const item = await Inventory.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }

    await item.deleteOne();

    res.json({ success: true, message: 'Inventory item deleted successfully' });
  } catch (error) {
    console.error('Delete inventory error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Inventory item not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get inventory statistics
// @route   GET /api/inventory/stats/summary
// @access  Private
const getInventoryStats = async (req, res) => {
  try {
    const total = await Inventory.countDocuments();
    const totalValue = await Inventory.aggregate([
      { $group: { _id: null, total: { $sum: { $multiply: ['$stock', '$unitCost'] } } } }
    ]);

    const lowStock = await Inventory.countDocuments({
      $expr: { $lte: ['$stock', '$minRequired'] }
    });

    const critical = await Inventory.countDocuments({
      $expr: { $lte: ['$stock', { $divide: ['$minRequired', 2] }] }
    });

    const outOfStock = await Inventory.countDocuments({ stock: 0 });

    // Count by category
    const byCategory = await Inventory.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 }, value: { $sum: { $multiply: ['$stock', '$unitCost'] } } } }
    ]);

    // Count by status
    const byStatus = await Inventory.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      data: {
        total,
        totalValue: totalValue[0]?.total || 0,
        lowStock,
        critical,
        outOfStock,
        byCategory,
        byStatus
      }
    });
  } catch (error) {
    console.error('Get inventory stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllInventory,
  getInventoryById,
  getInventoryByPartNumber,
  createInventory,
  updateInventory,
  updateStock,
  deleteInventory,
  getInventoryStats
};
