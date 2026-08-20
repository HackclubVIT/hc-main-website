import 'dotenv/config';
import nodemailer from 'nodemailer';

const smtpUser = process.env.SMTP_USER || 'khandelwalprachi42@gmail.com';
const smtpPass = process.env.SMTP_PASS || '';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  debug: true,
  logger: true,
  auth: {
    user: smtpUser,
    pass: smtpPass
  }
});

async function main() {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  console.log('Sending test email to prachikhandelwal2024@vitstudent.ac.in and khandelwalprachi42@gmail.com...');
  try {
    const info = await transporter.sendMail({
      from: smtpUser,
      to: ['prachikhandelwal12@gmail.com'],
      subject: `HackClub Verification Code: ${otp}`,
      text: `Your HackClub VIT Chennai OTP verification code is: ${otp}\n\nThis code is valid for 5 minutes.`,
      html: `<p>Your HackClub VIT Chennai OTP verification code is: <b>${otp}</b></p>`
    });
    console.log('Final Result:', info);
  } catch (err) {
    console.error('Final Error:', err);
  }
}

main();
