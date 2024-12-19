const express = require("express");
const router = express.Router();
const {
  verifyTwoFactor,
  resendOtp,
} = require("../controllers/twoFactorController");


router.post("/verify", verifyTwoFactor);
router.post("/resend-otp", resendOtp);

module.exports = router;
