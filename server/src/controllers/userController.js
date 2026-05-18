const User = require('../models/User');
const Goal = require('../models/Goal');

// @desc    Get team members
// @route   GET /api/users/team
// @access  Private (Manager/Admin)
exports.getTeamMembers = async (req, res) => {
  try {

    // FETCH ALL EMPLOYEES
    const team = await User.find({
      role: 'Employee'
    }).select('-password');

    // ADD GOAL STATS
    const teamWithStats = await Promise.all(

      team.map(async (member) => {

        const goals = await Goal.find({
          employeeId: member._id
        });

        // STATUS COUNTS
        const submittedCount = goals.filter(
          (g) => g.status === 'Submitted'
        ).length;

        const approvedCount = goals.filter(
          (g) =>
            g.status === 'Locked' ||
            g.status === 'Approved'
        ).length;

        // STATUS
        let status = 'Draft';

        if (submittedCount > 0) {
          status = 'Submitted';
        }

        if (
          approvedCount === goals.length &&
          goals.length > 0
        ) {
          status = 'Approved';
        }

        // AVG PROGRESS
        const avgProgress =
          goals.length > 0
            ? Math.round(
                goals.reduce(
                  (acc, g) =>
                    acc +
                    (
                      ((g.progress || 0) /
                        (g.target || 1)) *
                      100
                    ),
                  0
                ) / goals.length
              )
            : 0;

        return {
          _id: member._id,
          name: member.name,
          email: member.email,
          role: member.role,
          department: member.department,
          status,
          progress: avgProgress,
          lastActive:
            member.updatedAt || member.createdAt,
        };
      })
    );

    res.json(teamWithStats);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: error.message
    });
  }
};

// @desc    Get goals for a specific employee
// @route   GET /api/users/team/:id/goals
// @access  Private (Manager/Admin)
exports.getEmployeeGoalsForManager = async (
  req,
  res
) => {
  try {

    const goals = await Goal.find({
      employeeId: req.params.id
    }).sort({ createdAt: -1 });

    res.json(goals);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: error.message
    });
  }
};