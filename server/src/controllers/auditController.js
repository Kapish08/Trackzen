const AuditLog = require('../models/AuditLog');

// @desc    Get all audit logs
// @route   GET /api/audit
// @access  Private (Admin)
exports.getAuditLogs = async (req, res) => {
  try {
    const { page = 1, limit = 50, action, userId } = req.query;

    const query = {};
    if (action) query.action = action;
    if (userId) query.userId = userId;

    const logs = await AuditLog.find(query)
      .populate('userId', 'name email role')
      .sort({ timestamp: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await AuditLog.countDocuments(query);

    res.json({
      logs,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
