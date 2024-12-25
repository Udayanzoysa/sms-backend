require("dotenv").config();
const nodemailer = require("nodemailer");
const transporter = require("../config/email");

const sendEmail = async (to, subject, text) => {
  try {
    // Email options
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: to,
      subject: subject,
      text: text,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
  } catch (error) {
    console.error("Error sending email:", error.message);
  }
};

module.exports = { sendEmail };
