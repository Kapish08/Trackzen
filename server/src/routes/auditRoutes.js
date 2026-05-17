const express = require('express');
const router = express.Router();
const { getAuditLogs } = require('../controllers/auditController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, authorize('Admin'), getAuditLogs);

module.exports = router;
