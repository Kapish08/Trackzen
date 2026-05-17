const User = require('../models/User');
const Goal = require('../models/Goal');

// @desc    Get team members for a manager
// @route   GET /api/users/team
// @access  Private (Manager/Admin)
exports.getTeamMembers = async (req, res) => {
  try {
    const team = await User.find({ managerId: req.user._id })
      .select('-password')
      .populate('department');
    
    // For each member, calculate their goal status and progress
    const teamWithStats = await Promise.all(team.map(async (member) => {
      const goals = await Goal.find({ employeeId: member._id });
      
      const submittedCount = goals.filter(g => g.status === 'Submitted').length;
      const approvedCount = goals.filter(g => g.status === 'Locked' || g.status === 'Approved').length;
      
      let status = 'Draft';
      if (submittedCount > 0) status = 'Submitted';
      if (approvedCount === goals.length && goals.length > 0) status = 'Approved';

      const avgProgress = goals.length > 0 
        ? Math.round(goals.reduce((acc, g) => acc + ((g.progress || 0) / g.target * 100), 0) / goals.length)
        : 0;

      return {
        ...member._doc,
        status,
        progress: avgProgress
      };
    }));

    res.json(teamWithStats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get goals for a specific employee (Manager view)
// @route   GET /api/users/team/:id/goals
// @access  Private (Manager/Admin)
exports.getEmployeeGoalsForManager = async (req, res) => {
  try {
    const goals = await Goal.find({ employeeId: req.params.id }).sort({ createdAt: -1 });
    res.json(goals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
