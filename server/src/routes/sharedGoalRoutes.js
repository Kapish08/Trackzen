const express = require('express');
const router = express.Router();
const { createSharedGoal, getSharedGoals } = require('../controllers/sharedGoalController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('Manager', 'Admin'), createSharedGoal);
router.get('/', protect, getSharedGoals);

module.exports = router;
