const PredictiveMaintenance = require('../../ml-service/predictive-maintenance');
const Aircraft = require('../models/Aircraft');

// Create a single instance of the predictor that persists across requests
let predictor = null;
let modelTrained = false;

// Helper to get or create predictor instance
async function getPredictor(token) {
  if (!predictor) {
    console.log('🔄 Creating new predictor instance...');
    predictor = new PredictiveMaintenance();
  }
  
  // Always set the token (it might have changed)
  predictor.setToken(token);
  
  // Train the model if not already trained
  if (!modelTrained) {
    console.log('🔄 Model not trained, training now...');
    const result = await predictor.trainModel();
    if (result) {
      modelTrained = true;
      console.log('✅ Model trained successfully');
    } else {
      console.log('❌ Model training failed');
    }
  }
  
  return predictor;
}

// @desc    Get maintenance prediction for a specific aircraft
// @route   GET /api/predictions/aircraft/:id
// @access  Private
const predictAircraft = async (req, res) => {
  try {
    const aircraft = await Aircraft.findById(req.params.id);
    if (!aircraft) {
      return res.status(404).json({ message: 'Aircraft not found' });
    }

    // Get token from request
    const token = req.headers.authorization.split(' ')[1];
    
    const predictor = await getPredictor(token);
    const prediction = await predictor.predictAircraftMaintenance(aircraft);
    res.json({ success: true, data: prediction });
  } catch (error) {
    console.error('Prediction error:', error);
    res.status(500).json({ message: 'Failed to generate prediction' });
  }
};

// @desc    Get predictions for entire fleet
// @route   GET /api/predictions/fleet
// @access  Private
const predictFleet = async (req, res) => {
  try {
    // Get token from request
    const token = req.headers.authorization.split(' ')[1];
    
    const predictor = await getPredictor(token);
    const predictions = await predictor.predictFleetMaintenance();
    
    res.json({ 
      success: true, 
      data: predictions,
      summary: {
        total: predictions.length,
        critical: predictions.filter(p => p.riskLevel === 'Critical').length,
        medium: predictions.filter(p => p.riskLevel === 'Medium').length,
        low: predictions.filter(p => p.riskLevel === 'Low').length
      }
    });
  } catch (error) {
    console.error('Fleet prediction error:', error);
    res.status(500).json({ message: 'Failed to generate fleet predictions' });
  }
};

// @desc    Train the prediction model
// @route   POST /api/predictions/train
// @access  Private (Admin only)
const trainModel = async (req, res) => {
  try {
    // Get token from request
    const token = req.headers.authorization.split(' ')[1];
    
    const predictor = await getPredictor(token);
    const result = await predictor.trainModel();
    
    if (result) {
      modelTrained = true;
      res.json({ success: true, message: 'Model trained successfully' });
    } else {
      res.status(500).json({ message: 'Failed to train model' });
    }
  } catch (error) {
    console.error('Training error:', error);
    res.status(500).json({ message: 'Failed to train model' });
  }
};

module.exports = {
  predictAircraft,
  predictFleet,
  trainModel
};
