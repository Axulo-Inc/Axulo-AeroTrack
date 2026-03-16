const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  predictAircraft,
  predictFleet,
  trainModel
} = require('../controllers/prediction.controller');

// All routes are protected
router.use(protect);

// Fleet prediction (all aircraft)
router.get('/fleet', predictFleet);

// Single aircraft prediction
router.get('/aircraft/:id', predictAircraft);

// Train model (admin only)
router.post('/train', authorize('admin'), trainModel);

module.exports = router;
