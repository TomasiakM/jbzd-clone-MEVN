const Meme = require("../../models/Meme");
const convertMeme = require("../../scripts/convertMeme");

module.exports = async (req, res, next) => {
  const query = {};
  if (!req.user) query.isOnMainPage = true;

  let memes = await Meme.find(query)
    .populate("author", "username accountType")
    .populate("category")
    .lean();

  memes = memes.filter((e) => {
    if (!e.category || !e.category.isForAuthUsers) {
      return true;
    }
    return false;
  });

  if (!memes.length) return res.send({ error: "Brak memów" });

  const random = Math.floor(Math.random() * memes.length);

  const meme = await convertMeme(memes[random], req.user);

  res.send({ meme });
};
