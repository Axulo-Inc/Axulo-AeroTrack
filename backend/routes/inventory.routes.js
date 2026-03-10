const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { validateInventory } = require('../utils/validation');

// We'll create this controller next
const {
  getAllInventory,
  getInventoryById,
  getInventoryByPartNumber,
  createInventory,
  updateInventory,
  updateStock,
  deleteInventory,
  getInventoryStats
} = require('../controllers/inventory.controller');

// All routes are protected
router.use(protect);

// Stats route
router.get('/stats/summary', getInventoryStats);

// Get by part number
router.get('/part/:partNumber', getInventoryByPartNumber);

// Update stock
router.patch('/:id/stock', updateStock);

// CRUD routes
router.route('/')
  .get(getAllInventory)
  .post(authorize('admin', 'manager'), validateInventory, createInventory);

router.route('/:id')
  .get(getInventoryById)
  .put(authorize('admin', 'manager'), updateInventory)
  .delete(authorize('admin'), deleteInventory);

module.exports = router;
