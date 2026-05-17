const cron = require('node-cron');
const Goal = require('../models/Goal');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { sendEmail } = require('../services/notificationService');

// Run every day at 9 AM
cron.schedule('0 9 * * *', async () => {
  console.log('Running Escalation Engine...');

  try {
    // 1. Find employees who haven't submitted goals for current quarter
    // (Logic: Current date is after submission deadline)
    const deadline = new Date();
    deadline.setDate(deadline.getDate() - 7); // 7 days late

    const pendingGoals = await Goal.find({ 
      status: 'Draft', 
      createdAt: { $lt: deadline } 
    }).populate('employeeId');

    for (const goal of pendingGoals) {
      // Escalation logic
      console.log(`Escalating late submission for ${goal.employeeId.name}`);
      
      // Create Notification
      await Notification.create({
        userId: goal.employeeId._id,
        title: 'URGENT: Goal Submission Overdue',
        message: 'Your goal sheet is 7 days overdue. Please submit immediately to avoid escalation.',
        type: 'ESCALATION'
      });

      // Email
      await sendEmail(
        goal.employeeId.email, 
        'URGENT: Goal Submission Overdue', 
        `<p>Your goal sheet is overdue. Please submit now.</p>`
      );
    }

    // 2. Find managers who haven't approved goals for > 3 days
    const managerDeadline = new Date();
    managerDeadline.setDate(managerDeadline.getDate() - 3);

    const pendingApprovals = await Goal.find({ 
      status: 'Submitted', 
      updatedAt: { $lt: managerDeadline } 
    }).populate('employeeId');

    for (const goal of pendingApprovals) {
      const employee = goal.employeeId;
      if (employee.managerId) {
        const manager = await User.findById(employee.managerId);
        if (manager) {
          await Notification.create({
            userId: manager._id,
            title: 'Action Required: Pending Goal Approval',
            message: `The goal sheet for ${employee.name} has been pending for 3 days.`,
            type: 'ESCALATION'
          });
        }
      }
    }

  } catch (error) {
    console.error('Escalation Engine Error:', error);
  }
});
