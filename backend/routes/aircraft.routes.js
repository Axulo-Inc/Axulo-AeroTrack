const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { validateAircraft } = require('../utils/validation');

const {
  getAllAircraft,
  getAircraftById,
  createAircraft,
  updateAircraft,
  deleteAircraft,
  getAircraftStats
} = require('../controllers/aircraft.controller');

// All routes are protected
router.use(protect);

// Stats route (should come before /:id)
router.get('/stats/summary', getAircraftStats);

// CRUD routes
router.route('/')
  .get(getAllAircraft)
  .post(authorize('admin', 'manager'), validateAircraft, createAircraft);

router.route('/:id')
  .get(getAircraftById)
  .put(authorize('admin', 'manager'), updateAircraft)
  .delete(authorize('admin'), deleteAircraft);

module.exports = router;
