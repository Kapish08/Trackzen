const Goal = require('../models/Goal');
const AuditLog = require('../models/AuditLog');
const Notification = require('../models/Notification');

// @desc    Create new goals
// @route   POST /api/goals
// @access  Private (Employee)
exports.createGoals = async (req, res) => {
  const { goals, quarter, year } = req.body;

  try {
    // Validation: Max 8 goals
    if (goals.length > 8) {
      return res.status(400).json({ message: 'Maximum 8 goals allowed per employee' });
    }

    // Validation: Total weightage must be 100
    const totalWeightage = goals.reduce((sum, g) => sum + Number(g.weightage), 0);
    if (totalWeightage !== 100) {
      return res.status(400).json({ message: 'Total weightage must be exactly 100%' });
    }

    // Validation: Min 10% per goal
    if (goals.some(g => g.weightage < 10)) {
      return res.status(400).json({ message: 'Minimum weightage for any goal is 10%' });
    }

    const createdGoals = await Promise.all(goals.map(async (goalData) => {
      let goal;
      
      if (goalData._id) {
        // Update existing goal
        goal = await Goal.findByIdAndUpdate(goalData._id, {
          ...goalData,
          status: 'Submitted',
          quarter,
          year
        }, { new: true });
      } else {
        // Create new goal
        goal = await Goal.create({
          ...goalData,
          employeeId: req.user._id,
          quarter,
          year,
          status: 'Submitted'
        });
      }

      // Audit Log
      await AuditLog.create({
        action: 'GOAL_SUBMITTED',
        userId: req.user._id,
        entityId: goal._id,
        entityType: 'Goal',
        newValue: goal
      });

      return goal;
    }));

    // Notify Manager
    if (req.user.managerId) {
      await Notification.create({
        userId: req.user.managerId,
        title: 'Goal Sheet Submitted',
        message: `${req.user.name} has submitted their goal sheet for ${quarter} ${year}.`,
        type: 'GOAL_SUBMITTED',
        link: `/team/review/${req.user._id}`
      });
    }

    res.status(201).json(createdGoals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get employee goals
// @route   GET /api/goals
// @access  Private
exports.getEmployeeGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ employeeId: req.user._id }).sort({ createdAt: -1 });
    res.json(goals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update goal status (Manager)
// @route   PUT /api/goals/:id/status
// @access  Private (Manager/Admin)
exports.updateGoalStatus = async (req, res) => {
  const { status, comment } = req.body;

  try {
    const goal = await Goal.findById(req.params.id);
    if (!goal) return res.status(404).json({ message: 'Goal not found' });

    const oldValue = goal.status;
    goal.status = status;
    if (comment) {
      goal.comments.push({ user: req.user._id, text: comment });
    }
    
    // If approved, lock the goal
    if (status === 'Approved') {
      goal.status = 'Locked';
    }

    await goal.save();

    // Audit Log
    await AuditLog.create({
      action: 'GOAL_STATUS_UPDATED',
      userId: req.user._id,
      entityId: goal._id,
      entityType: 'Goal',
      oldValue,
      newValue: status
    });

    // Notify Employee
    await Notification.create({
      userId: goal.employeeId,
      title: `Goal ${status}`,
      message: `Your goal "${goal.title}" has been ${status.toLowerCase()} by ${req.user.name}.`,
      type: status === 'Approved' ? 'GOAL_APPROVED' : 'GOAL_REJECTED',
      link: '/goals'
    });

    res.json(goal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update goal progress (Employee check-in)
// @route   PUT /api/goals/:id/progress
// @access  Private (Employee)
exports.updateGoalProgress = async (req, res) => {
  const { progress } = req.body;
  try {
    const goal = await Goal.findById(req.params.id);
    if (!goal) return res.status(404).json({ message: 'Goal not found' });
    if (goal.employeeId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this goal' });
    }
    goal.progress = progress;
    await goal.save();
    res.json(goal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
