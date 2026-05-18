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

router.get(
  '/',
  protect,
  authorize('Admin'),
  getAuditLogs
);

router.get(
  '/export',
  protect,
  authorize('Admin'),
  exportAuditLogs
);

module.exports = router;