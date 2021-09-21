const Meme = require("../../../models/Meme");

module.exports = async (req, res) => {
  const { id } = req.params;

  const meme = await Meme.findById(id);

  const favoriteIndex = meme.favoritesList.findIndex((e) => e.user == req.user);

  let isFavorite = false;
  if (favoriteIndex < 0) {
    meme.favoritesList.push({ user: req.user });
    isFavorite = true;
  } else
    meme.favoritesList = meme.favoritesList.filter((e) => e.user != req.user);

  await meme.save();

  res.send({ success: true, isFavorite });
};
