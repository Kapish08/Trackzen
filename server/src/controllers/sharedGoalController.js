const SharedGoal = require('../models/SharedGoal');
const Goal = require('../models/Goal');
const User = require('../models/User');
const Notification = require('../models/Notification');
const AuditLog = require('../models/AuditLog');

// @desc    Create and cascade shared goal
// @route   POST /api/shared-goals
// @access  Private (Admin/Manager)
exports.createSharedGoal = async (req, res) => {
  const { title, description, target, uom, departmentId } = req.body;

  try {
    const sharedGoal = await SharedGoal.create({
      title,
      description,
      target,
      uom,
      departmentId,
      createdBy: req.user._id
    });

    // Find all employees to cascade the shared goal
    // department field in User is a String, not an ObjectId
    const query = { role: 'Employee' };
    if (departmentId) {
      query.department = departmentId; // departmentId is actually a department name string
    }
    const employees = await User.find(query);
    console.log(`Cascading shared goal to ${employees.length} employees`);

    // Cascade to each employee's goal sheet
    const cascadedGoals = await Promise.all(employees.map(async (emp) => {
      const goal = await Goal.create({
        title,
        description,
        thrustArea: 'Departmental KPI',
        uom,
        target,
        weightage: 10,
        status: 'Approved', // Use 'Approved' so it shows in Check-ins
        employeeId: emp._id,
        quarter: 'Q2-2024',
        year: 2024,
        isShared: true,
        sharedGoalId: sharedGoal._id
      });

      // Notify Employee
      await Notification.create({
        userId: emp._id,
        title: 'New Shared Goal Assigned',
        message: `A new departmental KPI "${title}" has been assigned to you.`,
        type: 'SHARED_GOAL',
        link: '/goals'
      });

      return goal;
    }));

    sharedGoal.assignedCount = cascadedGoals.length;
    await sharedGoal.save();

    // Audit Log
    await AuditLog.create({
      action: 'SHARED_GOAL_CREATED',
      userId: req.user._id,
      entityId: sharedGoal._id,
      entityType: 'SharedGoal',
      newValue: sharedGoal
    });

    res.status(201).json(sharedGoal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all shared goals
// @route   GET /api/shared-goals
// @access  Private
exports.getSharedGoals = async (req, res) => {
  try {
    const goals = await SharedGoal.find().populate('departmentId', 'name');
    res.json(goals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
