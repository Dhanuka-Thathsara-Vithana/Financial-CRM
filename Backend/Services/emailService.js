const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

const sendPasswordResetEmail = async (email, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Password Reset - Financial CRM',
    html: `
      <h1>Password Reset Request</h1>
      <p>You requested a password reset for your Financial CRM account.</p>
      <p>Please click the link below to reset your password. This link is valid for 1 hour.</p>
      <a href="${resetUrl}">Reset Password</a>
      <p>If you didn't request this, please ignore this email.</p>
    `
  };
  
  return transporter.sendMail(mailOptions);
};

module.exports = {
  sendPasswordResetEmail
};
