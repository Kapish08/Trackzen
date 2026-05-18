const AuditLog = require('../models/AuditLog');

// GET AUDIT LOGS
const getAuditLogs = async (req, res) => {
  try {

    const logs = await AuditLog.find()
      .populate('userId', 'name email role')
      .sort({ createdAt: -1 });

    res.json({
      logs
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};

// EXPORT AUDIT LOGS
const exportAuditLogs = async (req, res) => {
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

    res.send(csv);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};

module.exports = {
  getAuditLogs,
  exportAuditLogs
};