const mongoose = require('mongoose');

const defectSchema = new mongoose.Schema({
  aircraft: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Aircraft',
    required: true
  },
  aircraftRegistration: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  severity: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Low'
  },
  status: {
    type: String,
    enum: ['Open', 'In Progress', 'Closed', 'Deferred'],
    default: 'Open'
  },
  category: {
    type: String,
    enum: ['Mechanical', 'Electrical', 'Hydraulic', 'Avionics', 'Structural', 'Other'],
    default: 'Other'
  },
  ataChapter: {
    type: String,
    default: '00'
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reportedDate: {
    type: Date,
    default: Date.now
  },
  resolvedDate: {
    type: Date
  },
  resolution: {
    type: String
  },
  downtime: {
    type: Number, // in hours
    default: 0
  },
  cost: {
    type: Number,
    default: 0
  },
  attachments: [{
    name: String,
    url: String,
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    uploadDate: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

// Index for faster queries
defectSchema.index({ aircraft: 1, status: 1 });
defectSchema.index({ severity: 1 });
defectSchema.index({ reportedDate: -1 });

module.exports = mongoose.model('Defect', defectSchema);
