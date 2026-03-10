const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema({
  aircraft: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Aircraft',
    required: true
  },
  aircraftRegistration: {
    type: String,
    required: true
  },
  task: {
    type: String,
    required: [true, 'Task description is required']
  },
  type: {
    type: String,
    enum: ['Scheduled', 'Unscheduled', 'Inspection', 'Repair', 'Overhaul'],
    default: 'Scheduled'
  },
  status: {
    type: String,
    enum: ['Scheduled', 'In Progress', 'Completed', 'Cancelled', 'Deferred'],
    default: 'Scheduled'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  scheduledDate: {
    type: Date,
    required: true
  },
  startDate: {
    type: Date
  },
  completedDate: {
    type: Date
  },
  estimatedHours: {
    type: Number,
    min: 0
  },
  actualHours: {
    type: Number,
    min: 0
  },
  assignedTo: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  notes: {
    type: String
  },
  parts: [{
    part: { type: mongoose.Schema.Types.ObjectId, ref: 'Inventory' },
    quantity: Number
  }],
  cost: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Maintenance', maintenanceSchema);
