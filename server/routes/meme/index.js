const router = require("express").Router();
const verifyToken = require("../../middleware/verifyToken");
const verifyTokenOptional = require("../../middleware/verifyTokenOptional");

const single = require("./single");
const main = require("./main");
const second = require("./second");
const category = require("./category");
const closeCategory = require("./closeCategory");
const tag = require("./tag");
const favorites = require("./favorites");
const user = require("./user");
const upload = require("./upload");
const random = require("./random");
const action = require("./action");

router.get("/single/:id", verifyTokenOptional, single);
router.get("/main/:page", verifyTokenOptional, main);
router.get("/second/:page", verifyToken, second);
router.get("/category/:category/:page", verifyTokenOptional, category);
router.get("/close-category/:category/:page", verifyToken, closeCategory);
router.get("/tag/:tag/:page", verifyTokenOptional, tag);
router.get("/favorites/:page", verifyToken, favorites);
router.get("/user/:username/:page", verifyTokenOptional, user);
router.post("/upload", verifyToken, upload);
router.get("/random", verifyTokenOptional, random);
router.use("/action", action);

module.exports = router;
