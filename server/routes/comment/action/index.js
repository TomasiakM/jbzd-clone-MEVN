const router = require("express").Router();
const verifyToken = require("../../../middleware/verifyToken");

const like = require("./like");
const dislike = require("./dislike");

router.put("/like/:id", verifyToken, like);
router.put("/dislike/:id", verifyToken, dislike);

module.exports = router;
