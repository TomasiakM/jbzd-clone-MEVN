const router = require("express").Router();
const verifyToken = require("../../middleware/verifyToken");

const register = require("./register");
const login = require("./login");
const verify = require("./verify");

router.post("/register", register);

router.post("/login", login);

router.post("/verify", verifyToken, verify);

module.exports = router;
