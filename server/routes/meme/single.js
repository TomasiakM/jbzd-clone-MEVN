const Meme = require("../../models/Meme");
const { isValidObjectId } = require("mongoose");
const convertMeme = require("../../scripts/convertMeme");

module.exports = async (req, res, next) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) return next();

  let meme = await Meme.findById(id)
    .populate("author", "username accountType")
    .populate("category")
    .lean();

  if (!meme) return next();
  if (!meme.isOnMainPage && !req.user) {
    const { title, isOnMainPage, category } = meme;
    return res.send({
      error: "Mem dostępny dla zalogowanych",
      meme: { title, isOnMainPage, category },
    });
  }

  meme = await convertMeme(meme, req.user);
  res.send({ meme });
};
