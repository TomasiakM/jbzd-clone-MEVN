const router = require("express").Router();
const verifyTokenOptional = require("../../middleware/verifyTokenOptional");
const verifyToken = require("../../middleware/verifyToken");

const info = require("./info");
const like = require("./like");
const imageUpload = require("./imageUpload");
const password = require("./password");

router.get("/info/:username", verifyTokenOptional, info);
router.put("/like/:username", verifyToken, like);
router.put("/image", verifyToken, imageUpload);
router.put("/password", verifyToken, password);

module.exports = router;
