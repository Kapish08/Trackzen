const express = require('express');

const router = express.Router();

const {
  createGoals,
  getEmployeeGoals,
  updateGoalStatus,
  updateGoalProgress
} = require('../controllers/goalController');

const {
  protect,
  authorize
} = require('../middleware/auth');

// CREATE GOALS
// Employee + Manager can create goals
router.post(
  '/',
  protect,
  authorize('Employee', 'Manager'),
  createGoals
);

// GET OWN GOALS
router.get(
  '/',
  protect,
  getEmployeeGoals
);

// APPROVE GOALS
// Manager approves Employee goals
// Admin approves Manager goals
router.put(
  '/:id/status',
  protect,
  authorize('Manager', 'Admin'),
  updateGoalStatus
);

// UPDATE PROGRESS
router.put(
  '/:id/progress',
  protect,
  updateGoalProgress
);

module.exports = router;