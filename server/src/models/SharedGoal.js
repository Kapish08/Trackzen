const mongoose = require('mongoose');

const sharedGoalSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  target: { type: Number, required: true },
  uom: { 
    type: String, 
    enum: ['Numeric', 'Percentage', 'Timeline', 'Zero-based'], 
    required: true 
  },
  departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isActive: { type: Boolean, default: true },
  assignedCount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('SharedGoal', sharedGoalSchema);
