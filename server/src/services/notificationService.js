const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendEmail = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"TrackZen" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log('Email sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Email error:', error);
  }
};

exports.getGoalSubmissionTemplate = (userName, quarter) => `
  <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
    <h2 style="color: #0ea5e9;">Goal Sheet Submitted</h2>
    <p>Hello,</p>
    <p><strong>${userName}</strong> has submitted their goal sheet for <strong>${quarter}</strong>.</p>
    <p>Please log in to the TrackZen portal to review and approve.</p>
    <a href="${process.env.CLIENT_URL}/team" style="display: inline-block; padding: 10px 20px; background-color: #0ea5e9; color: #fff; text-decoration: none; border-radius: 5px;">Review Goals</a>
    <p>Best regards,<br>TrackZen Team</p>
  </div>
`;
