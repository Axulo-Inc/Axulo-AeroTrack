const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { validateDefect } = require('../utils/validation');

const {
  getAllDefects,
  getDefectsByAircraft,
  getDefectById,
  createDefect,
  updateDefect,
  deleteDefect,
  getDefectStats
} = require('../controllers/defect.controller');

// All routes are protected
router.use(protect);

// Stats route
router.get('/stats/summary', getDefectStats);

// Get defects by aircraft
router.get('/aircraft/:aircraftId', getDefectsByAircraft);

// CRUD routes
router.route('/')
  .get(getAllDefects)
  .post(validateDefect, createDefect);

router.route('/:id')
  .get(getDefectById)
  .put(updateDefect)
  .delete(authorize('admin', 'manager'), deleteDefect);

module.exports = router;
