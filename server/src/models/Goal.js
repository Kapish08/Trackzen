const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  thrustArea: { type: String, required: true },
  uom: { 
    type: String, 
    enum: ['Numeric', 'Percentage', 'Timeline', 'Zero-based'], 
    required: true 
  },
  target: { type: Number, required: true },
  progress: { type: Number, default: 0 },
  weightage: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['Draft', 'Submitted', 'Approved', 'Rework Requested', 'Locked'], 
    default: 'Draft' 
  },
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  quarter: { type: String, required: true }, // e.g., 'Q1-2024'
  year: { type: Number, required: true },
  comments: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text: String,
    createdAt: { type: Date, default: Date.now }
  }],
  isShared: { type: Boolean, default: false },
  sharedGoalId: { type: mongoose.Schema.Types.ObjectId, ref: 'SharedGoal' }
}, { timestamps: true });

module.exports = mongoose.model('Goal', goalSchema);
