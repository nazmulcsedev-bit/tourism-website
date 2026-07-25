const nodemailer = require('nodemailer');

// Gmail SMTP transporter — uses an "App Password", not your normal Gmail password.
// See backend/README.md for how to generate one.
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Sends an email. Never throws — logs the error instead, so a failed email
 * never breaks the booking/signup flow itself.
 */
const sendEmail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: `"Bhromon" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`📧 Email sent to ${to}: ${subject}`);
  } catch (error) {
    console.error(`❌ Email failed to send to ${to}:`, error.message);
  }
};

module.exports = sendEmail;