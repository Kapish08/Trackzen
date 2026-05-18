const express = require('express');

const router = express.Router();

const {
  getAuditLogs,
  exportAuditLogs
} = require('../controllers/auditController');

const {
  protect,
  authorize
} = require('../middleware/auth');

// GET ALL AUDIT LOGS
router.get(
  '/',
  protect,
  authorize('Admin'),
  getAuditLogs
);

// EXPORT AUDIT LOGS CSV
router.get(
  '/export',
  protect,
  authorize('Admin'),
  exportAuditLogs
);

module.exports = router;