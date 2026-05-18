const AuditLog = require('../models/AuditLog');

// GET AUDIT LOGS
exports.getAuditLogs = async (req, res) => {
  try {

    const {
      page = 1,
      limit = 50,
      action,
      userId
    } = req.query;

    const query = {};

    if (action) {
      query.action = action;
    }

    if (userId) {
      query.userId = userId;
    }

    const logs = await AuditLog.find(query)
      .populate('userId', 'name email role')
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((page - 1) * limit);

    const count =
      await AuditLog.countDocuments(query);

    res.json({
      logs,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

// EXPORT AUDIT LOGS
exports.exportAuditLogs = async (req, res) => {
  try {

    const logs = await AuditLog.find()
      .populate('userId', 'name email role')
      .sort({ createdAt: -1 });

    let csv =
      'User,Email,Role,Action,Entity Type,Date\n';

    logs.forEach((log) => {

      csv += `"${log.userId?.name || 'Unknown'}",`;

      csv += `"${log.userId?.email || 'N/A'}",`;

      csv += `"${log.userId?.role || 'N/A'}",`;

      csv += `"${log.action || 'N/A'}",`;

      csv += `"${log.entityType || 'N/A'}",`;

      csv += `"${new Date(
        log.createdAt
      ).toLocaleString()}"\n`;

    });

    res.header(
      'Content-Type',
      'text/csv'
    );

    res.attachment(
      'audit-logs.csv'
    );

    return res.send(csv);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};