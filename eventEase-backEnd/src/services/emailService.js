const nodemailer = require('nodemailer');
require('dotenv').config();

// Create transporter
const createTransporter = () => {
  const config = {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_SECURE === 'true' || false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    // Add timeout and connection settings
    connectionTimeout: 60000, // 60 seconds
    greetingTimeout: 30000,   // 30 seconds
    socketTimeout: 60000,     // 60 seconds
  };

  // Add debug logging in development
  if (process.env.NODE_ENV !== 'production') {
    config.debug = true;
    config.logger = true;
  }

  return nodemailer.createTransport(config);
};

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP email
const sendOTPEmail = async (email, otp) => {
  try {
    console.log('📧 Attempting to send OTP email to:', email);
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: email,
      subject: 'EventEase - OTP Verification',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px;">
            <h2 style="color: #333; text-align: center;">EventEase OTP Verification</h2>
            <p style="color: #666; font-size: 16px;">Hello,</p>
            <p style="color: #666; font-size: 16px;">You have requested an OTP for your EventEase account. Please use the following code to verify your email:</p>
            
            <div style="background-color: #007bff; color: white; padding: 20px; text-align: center; border-radius: 5px; margin: 20px 0;">
              <h1 style="margin: 0; font-size: 32px; letter-spacing: 5px;">${otp}</h1>
            </div>
            
            <p style="color: #666; font-size: 14px;">This OTP is valid for 10 minutes. Do not share this code with anyone.</p>
            <p style="color: #666; font-size: 14px;">If you did not request this OTP, please ignore this email.</p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="color: #999; font-size: 12px; text-align: center;">© 2024 EventEase. All rights reserved.</p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ OTP email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending OTP email:', error.message);
    throw new Error('Failed to send OTP email');
  }
};

// Send email verification OTP
const sendEmailVerification = async (email, otp) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: email,
      subject: 'EventEase - Verify Your Email Address',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px;">
            <h2 style="color: #333; text-align: center;">Welcome to EventEase!</h2>
            <p style="color: #666; font-size: 16px;">Hello,</p>
            <p style="color: #666; font-size: 16px;">Thank you for signing up for EventEase. To complete your registration and start planning amazing events, please verify your email address using the OTP below:</p>

            <div style="background-color: #007bff; color: white; padding: 20px; text-align: center; border-radius: 5px; margin: 20px 0;">
              <h1 style="margin: 0; font-size: 32px; letter-spacing: 5px;">${otp}</h1>
            </div>

            <p style="color: #666; font-size: 14px;">This OTP is valid for 10 minutes. Do not share this code with anyone.</p>
            <p style="color: #666; font-size: 14px;">If you did not create an account with EventEase, please ignore this email.</p>

            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="color: #999; font-size: 12px; text-align: center;">© 2024 EventEase. All rights reserved.</p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email verification OTP sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending email verification OTP:', error.message);
    throw new Error('Failed to send email verification OTP');
  }
};

// Verify email configuration
const verifyEmailConfig = async () => {
  try {
    console.log('🔍 Verifying email configuration...');
    console.log('📧 EMAIL_HOST:', process.env.EMAIL_HOST);
    console.log('📧 EMAIL_PORT:', process.env.EMAIL_PORT);
    console.log('📧 EMAIL_USER:', process.env.EMAIL_USER ? 'Set' : 'Not set');
    console.log('📧 EMAIL_PASS:', process.env.EMAIL_PASS ? 'Set' : 'Not set');

    const transporter = createTransporter();
    await transporter.verify();
    console.log('✅ Email configuration verified successfully');
    return true;
  } catch (error) {
    console.error('❌ Email configuration verification failed:', error.message);
    console.error('💡 Common solutions:');
    console.error('   1. For Gmail: Use App Password instead of regular password');
    console.error('   2. Enable 2FA on your Google account');
    console.error('   3. Check if your email provider allows SMTP');
    console.error('   4. Try using services like SendGrid, Mailgun, or Brevo');
    return false;
  }
};

module.exports = {
  generateOTP,
  sendOTPEmail,
  sendEmailVerification,
  verifyEmailConfig
};
