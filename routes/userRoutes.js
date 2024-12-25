const express = require("express");
const router = express.Router();

router.post("/user/login/", loginUser);

module.exports = router;
