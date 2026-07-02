const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.APP_PASSWORD,
    },
    debug: true,
    logger: true
  });

  const html = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 10px;">
  
  <h2 style="color: #2563eb;">
    Password Reset Request
  </h2>

  <p>Hello,</p>

  <p>
    We received a request to reset the password associated with your account.
    To proceed with resetting your password, please use the One-Time Password (OTP) provided below.
  </p>

  <div style="text-align: center; margin: 30px 0;">
    <span style="
      display: inline-block;
      padding: 15px 30px;
      font-size: 28px;
      font-weight: bold;
      letter-spacing: 5px;
      background-color: #f3f4f6;
      border-radius: 8px;
    ">
      ${otp}
    </span>
  </div>

  <p>
    <strong>Important:</strong>
  </p>

  <ul>
    <li>This OTP is valid for the next 5 minutes.</li>
    <li>Do not share this OTP with anyone.</li>
    <li>Our team will never ask for your OTP or password.</li>
  </ul>

  <p>
    If you did not request a password reset, you can safely ignore this email.
    No changes will be made to your account unless this OTP is verified.
  </p>

  <p>
    If you continue to receive unexpected password reset emails,
    we recommend reviewing your account security settings.
  </p>

  <br/>

  <p>Regards,</p>
  <p><strong>BugBattle Team</strong></p>

  <hr />

  <p style="font-size: 12px; color: gray;">
    This is an automated message. Please do not reply to this email.
  </p>

</div>
`;
  await transporter.sendMail({
    from: process.env.EMAIL,
    to,
    subject,
    html,
  });
};

module.exports= sendEmail;