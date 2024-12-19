const express = require("express");
const router = express.Router();
const { refreshToken } = require("../controllers/tokenController");

router.post("/token/refresh", refreshToken);

module.exports = router;
