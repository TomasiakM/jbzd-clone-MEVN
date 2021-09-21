const Meme = require("../../../models/Meme");

module.exports = async (req, res) => {
  const { id } = req.params;

  const meme = await Meme.findById(id);

  const upVoteIndex = meme.upVotes.findIndex((e) => e.user == req.user);

  let isLiked = false;
  if (upVoteIndex < 0) {
    meme.upVotes.push({ user: req.user });
    isLiked = true;
  } else meme.upVotes = meme.upVotes.filter((e) => e.user != req.user);

  const upVotes = meme.upVotes.length;
  await meme.save();

  res.send({ success: true, isLiked, upVotes });
};
