const express = require('express');
const router = express.Router();
const { getTeamMembers, getEmployeeGoalsForManager } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.get('/team', protect, getTeamMembers);
router.get('/team/:id/goals', protect, getEmployeeGoalsForManager);

module.exports = router;
