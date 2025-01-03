const express = require("express");
const router = express.Router();
const {
  register,
  login,
  verifyUser,
} = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.post("/verify-token", verifyUser);

module.exports = router;
