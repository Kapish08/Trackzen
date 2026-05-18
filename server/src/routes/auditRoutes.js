const express = require('express');

const router = express.Router();

const auditController = require('../controllers/auditController');

const {
  protect,
  authorize
} = require('../middleware/auth');

router.get(
  '/',
  protect,
  authorize('Admin'),
  auditController.getAuditLogs
);

router.get(
  '/export',
  protect,
  authorize('Admin'),
  auditController.exportAuditLogs
);

module.exports = router;