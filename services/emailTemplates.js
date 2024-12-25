module.exports = {
  loginOtpTemplate: (otp) => `
    <html>
      <body>
        <p>Hello,</p>
        <p>Your OTP code for login is: <strong>${otp}</strong></p>
        <p>This code will expire in 5 minutes. Please do not share it with anyone.</p>
        <p>Best regards,<br>SMS App Team</p>
      </body>
    </html>
  `,

  registrationOtpTemplate: (otp) => `
    <html>
      <body>
        <p>Welcome to SMS App!</p>
        <p>Use the OTP code <strong>${otp}</strong> to verify your email/phone.</p>
        <p>This code is valid for 5 minutes. If you didn’t request this, please contact support.</p>
        <p>Best regards,<br>SMS App Team</p>
      </body>
    </html>
  `,

  resendOtpTemplate: (otp) => `
    <html>
      <body>
        <p>Hello,</p>
        <p>Here is your new OTP code: <strong>${otp}</strong></p>
        <p>This code will expire in 5 minutes. Please do not share it with anyone.</p>
        <p>Best regards,<br>SMS App Team</p>
      </body>
    </html>
  `,
};
