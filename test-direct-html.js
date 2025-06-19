// Test script to verify the email sending functionality
require('dotenv').config({ path: './.env.local' });
const nodemailer = require('nodemailer');

// Create a test transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || "yt781703@gmail.com",
    pass: process.env.EMAIL_PASSWORD
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Verify connection
transporter.verify(function(error, success) {
  if (error) {
    console.error("SMTP connection error:", error);
    console.error("Please check your email and password in .env.local file");
    process.exit(1);
  } else {
    console.log("SMTP server is ready to take our messages");
    runTest();
  }
});

// Test function
async function runTest() {
  const name = "Test User";
  const otp = "123456";
  const email = "yt781703@gmail.com"; // Your email for testing

  try {
    console.log("Starting test email sending process...");
    console.log("Recipient:", email);
    
    // Generate the HTML content directly - same as in sendverificationemial.ts
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Email Verification</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .container {
            border: 1px solid #ddd;
            border-radius: 5px;
            padding: 20px;
          }
          .header {
            text-align: center;
            padding-bottom: 10px;
            border-bottom: 1px solid #eee;
          }
          .code {
            font-size: 24px;
            font-weight: bold;
            text-align: center;
            margin: 20px 0;
            letter-spacing: 5px;
            color: #4F46E5;
          }
          .footer {
            margin-top: 20px;
            font-size: 12px;
            text-align: center;
            color: #777;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Email Verification</h2>
          </div>
          <p>Hello ${name},</p>
          <p>Thank you for signing up. Please use the verification code below to complete your registration:</p>
          <div class="code">${otp}</div>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request this verification, please ignore this email.</p>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Your Company. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send the email
    const info = await transporter.sendMail({
      from: '"Auth System Test" <yt781703@gmail.com>',
      to: email,
      subject: "Your Verification Code",
      html: htmlContent,
      text: `Hello ${name}, Your verification code is: ${otp}`,
    });

    console.log("Email sent successfully!");
    console.log("Message ID:", info.messageId);
    console.log("✅ TEST PASSED: Email with OTP sent correctly");
  } catch (error) {
    console.error("Error sending email:", error);
    console.log("❌ TEST FAILED");
  }
}
