const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  partNumber: {
    type: String,
    required: [true, 'Part number is required'],
    unique: true,
    uppercase: true,
    trim: true
  },
  name: {
    type: String,
    required: [true, 'Part name is required']
  },
  description: {
    type: String
  },
  category: {
    type: String,
    enum: ['Engine', 'Hydraulic', 'Avionics', 'Landing Gear', 'Electrical', 'Structural', 'Interior', 'Other'],
    required: true
  },
  manufacturer: {
    type: String
  },
  supplier: {
    type: String
  },
  unitCost: {
    type: Number,
    min: 0,
    default: 0
  },
  stock: {
    type: Number,
    min: 0,
    default: 0
  },
  minRequired: {
    type: Number,
    min: 0,
    default: 1
  },
  maxStock: {
    type: Number,
    min: 0
  },
  location: {
    type: String,
    default: 'Unknown'
  },
  status: {
    type: String,
    enum: ['In Stock', 'Low Stock', 'Critical', 'Out of Stock', 'On Order'],
    default: 'In Stock'
  },
  lastOrdered: {
    type: Date
  },
  lastUsed: {
    type: Date
  },
  compatibleAircraft: [{
    type: String // Aircraft types this part works with
  }],
  notes: {
    type: String
  }
}, {
  timestamps: true
});

// Update status based on stock level - FIXED VERSION
inventorySchema.pre('save', async function() {
  if (this.stock === 0) {
    this.status = 'Out of Stock';
  } else if (this.stock <= (this.minRequired / 2)) {
    this.status = 'Critical';
  } else if (this.stock <= this.minRequired) {
    this.status = 'Low Stock';
  } else {
    this.status = 'In Stock';
  }
});

module.exports = mongoose.model('Inventory', inventorySchema);
