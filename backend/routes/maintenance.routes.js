const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { validateMaintenance } = require('../utils/validation');

// We'll create this controller next
const {
  getAllMaintenance,
  getMaintenanceByAircraft,
  getMaintenanceById,
  createMaintenance,
  updateMaintenance,
  deleteMaintenance,
  updateProgress,
  getMaintenanceStats
} = require('../controllers/maintenance.controller');

// All routes are protected
router.use(protect);

// Stats route
router.get('/stats/summary', getMaintenanceStats);

// Get maintenance by aircraft
router.get('/aircraft/:aircraftId', getMaintenanceByAircraft);

// Update progress
router.patch('/:id/progress', updateProgress);

// CRUD routes
router.route('/')
  .get(getAllMaintenance)
  .post(authorize('admin', 'manager'), validateMaintenance, createMaintenance);

router.route('/:id')
  .get(getMaintenanceById)
  .put(authorize('admin', 'manager'), updateMaintenance)
  .delete(authorize('admin'), deleteMaintenance);

module.exports = router;
