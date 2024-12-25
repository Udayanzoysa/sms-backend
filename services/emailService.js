require("dotenv").config();
const nodemailer = require("nodemailer");
const transporter = require("../config/email");

const sendEmail = async (to, subject, text) => {
  try {
    // Email options
    const mailOptions = {
      from: `"SMS App" <${process.env.SENDER_EMAIL}>`,
      to: to,
      subject: subject,
      html: text,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
  } catch (error) {
    console.error("Error sending email:", error.message);
  }
};

module.exports = { sendEmail };
