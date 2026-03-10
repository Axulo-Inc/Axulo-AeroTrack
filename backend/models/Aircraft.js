const mongoose = require('mongoose');

const aircraftSchema = new mongoose.Schema({
  registration: {
    type: String,
    required: [true, 'Registration is required'],
    unique: true,
    uppercase: true,
    trim: true
  },
  type: {
    type: String,
    required: [true, 'Aircraft type is required'],
    trim: true
  },
  manufacturer: {
    type: String,
    required: true
  },
  model: {
    type: String,
    required: true
  },
  serialNumber: {
    type: String,
    unique: true,
    sparse: true
  },
  year: {
    type: Number
  },
  status: {
    type: String,
    enum: ['Active', 'Maintenance', 'Ground', 'Retired'],
    default: 'Active'
  },
  hours: {
    type: Number,
    default: 0,
    min: 0
  },
  cycles: {
    type: Number,
    default: 0,
    min: 0
  },
  lastMaintenance: {
    type: Date,
    default: Date.now
  },
  nextMaintenance: {
    type: Date
  },
  location: {
    type: String,
    default: 'Unknown'
  },
  owner: {
    type: String
  },
  notes: {
    type: String
  },
  documents: [{
    name: String,
    url: String,
    uploadDate: Date
  }]
}, {
  timestamps: true
});

// Calculate next maintenance based on hours
aircraftSchema.methods.calculateNextMaintenance = function() {
  const hoursSinceLast = this.hours - (this.lastMaintenanceHours || 0);
  const hoursRemaining = 100 - hoursSinceLast; // Assuming 100-hour inspection
  return hoursRemaining;
};

module.exports = mongoose.model('Aircraft', aircraftSchema);
