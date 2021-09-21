const router = require("express").Router();
const verifyAdminToken = require("../../middleware/verifyAdminToken");

const addToMainPage = require("./addToMainPage");
const remove = require("./delete");

router.put("/addToMainPage/:id", verifyAdminToken, addToMainPage);
router.delete("/meme/:id", verifyAdminToken, remove);

module.exports = router;
