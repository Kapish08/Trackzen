const express = require('express');
const router = express.Router();
const { createGoals, getEmployeeGoals, updateGoalStatus, updateGoalProgress } = require('../controllers/goalController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('Employee'), createGoals);
router.get('/', protect, getEmployeeGoals);
router.put('/:id/status', protect, authorize('Manager', 'Admin'), updateGoalStatus);
router.put('/:id/progress', protect, updateGoalProgress);

module.exports = router;
