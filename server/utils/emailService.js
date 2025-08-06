const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (to, subject, htmlContent) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: to,
    subject: subject,
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}: ${subject}`);
  } catch (error) {
    console.error(`Error sending email to ${to}:`, error);
  }
};

const sendVerificationEmail = async (userEmail, verificationToken) => {
  // The verification URL must point to the backend API endpoint
  const verificationLink = `http://localhost:5000/api/auth/verify-email?token=${verificationToken}`; 
  const htmlContent = `
    <h1>Email Verification</h1>
    <p>Please verify your email address by clicking on the link below:</p>
    <a href="${verificationLink}">Verify Email</a>
    <p>If you did not register for this service, please ignore this email.</p>
  `;
  await sendEmail(userEmail, 'Verify Your Email Address', htmlContent);
};

const sendPasswordResetEmail = async (userEmail, resetToken) => {
  const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
  const htmlContent = `
    <h1>Password Reset Request</h1>
    <p>You have requested to reset your password. Click the link below to reset it:</p>
    <a href="${resetLink}">Reset Password</a>
    <p>This link will expire in 1 hour. If you did not request a password reset, please ignore this email.</p>
  `;
  await sendEmail(userEmail, 'Password Reset Request', htmlContent);
};

const sendLowStockNotification = async (itemName, currentStock, threshold) => {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) {
    console.warn('ADMIN_EMAIL is not set in environment variables. Low stock notification not sent.');
    return;
  }
  const htmlContent = `
    <h1>⚠️ Low Stock Alert!</h1>
    <p>The inventory item <strong>${itemName}</strong> is running low.</p>
    <p>Current Stock: <strong>${currentStock}</strong></p>
    <p>Threshold: <strong>${threshold}</strong></p>
    <p>Please update the stock for this item in the admin dashboard.</p>
  `;
  await sendEmail(adminEmail, `Low Stock Alert: ${itemName}`, htmlContent);
};


module.exports = {
  sendEmail,
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendLowStockNotification,
};