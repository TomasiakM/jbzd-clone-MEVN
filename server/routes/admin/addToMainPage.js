const Meme = require("../../models/Meme");
const { isValidObjectId } = require("mongoose");

module.exports = async (req, res, next) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) return next();

  const meme = await Meme.findById(id).populate("category");
  if (meme.isOnMainPage)
    return res.send({ error: "Mem już jest na stronie głównej!" });

  if (meme.category && meme.category.isForAuthUsers)
    return res.send({
      error: "Nie możesz dodać na stronę główną mema z działu NSFW!",
    });

  meme.isOnMainPage = true;
  meme.isOnMainPageFrom = new Date();
  await meme.save();
  res.send({ success: true, message: "Mem dodanyna stronę główną!" });
};
