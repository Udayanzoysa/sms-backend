const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.zeptomail.com",
  port: 587,
  secure: false, // upgrade later with STARTTLS
  auth: {
    user: "emailapikey",
    pass: "wSsVR60i/hfwXal9mTf+L+ppmwkBVFz/Ekx42wOp6SL+TazHpsczxE3PU1ShHPNNFmI7EDBBpugtnRYB0ztdidorylFRWSiF9mqRe1U4J3x17qnvhDzNXGpbmheBLI0Kzw9vmWNnFcsm+g==",
  },
});

module.exports = transporter;
