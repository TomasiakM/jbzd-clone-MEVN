const router = require("express").Router();
const verifyToken = require("../../../middleware/verifyToken");

const favorite = require("./favorite");
const like = require("./like");

router.put("/favorite/:id", verifyToken, favorite);
router.put("/like/:id", verifyToken, like);

module.exports = router;
