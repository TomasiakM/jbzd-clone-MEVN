const router = require("express").Router();
const verifyToken = require("../../middleware/verifyToken");
const verifyTokenOptional = require("../../middleware/verifyTokenOptional");

const comment = require("./comment");
const userList = require("./userList");
const action = require("./action");

router.post("/", verifyToken, comment);
router.get("/user/:username/:page", verifyTokenOptional, userList);
router.use("/action", verifyToken, action);

module.exports = router;
