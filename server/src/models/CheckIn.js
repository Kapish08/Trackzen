const mongoose = require('mongoose');

const checkInSchema = new mongoose.Schema({
  goalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Goal', required: true },
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  quarter: { type: String, required: true },
  actualValue: { type: Number, required: true },
  progressPercentage: { type: Number, default: 0 },
  status: { 
    type: String, 
    enum: ['Not Started', 'On Track', 'Completed'], 
    default: 'Not Started' 
  },
  comments: { type: String },
  managerComments: { type: String },
  isReviewed: { type: Boolean, default: false }
}, { timestamps: true });

// Pre-save to calculate progress based on goal target
checkInSchema.pre('save', async function() {
  try {
    const Goal = mongoose.model('Goal');
    const goal = await Goal.findById(this.goalId);
    if (goal) {
      if (goal.uom === 'Percentage') {
        this.progressPercentage = (this.actualValue / goal.target) * 100;
      } else if (goal.uom === 'Numeric') {
        this.progressPercentage = (this.actualValue / goal.target) * 100;
      }
    }
  } catch (err) {
    throw err;
  }
});

module.exports = mongoose.model('CheckIn', checkInSchema);
