const User = require("../../models/User");
const Meme = require("../../models/Meme");
const Comment = require("../../models/Comment");

module.exports = async (req, res, next) => {
  const { username } = req.params;
  const user = await User.findOne({ username });

  if (!user) return next();

  const memesCreated = await Meme.find({
    author: user._id,
  }).countDocuments();

  const commentsCreated = await Comment.find({
    author: user._id,
  }).countDocuments();

  const profileUpVotes = user.profileUpVotes.length;

  const users = await User.find({})
    .sort({ profileUpVotes: -1, createdAt: 1 })
    .lean();
  const userRank = users.findIndex((e) => e._id.equals(user._id)) + 1;

  const upVote = user.profileUpVotes.find((e) => e.user == req.user);

  const isUpVoted = !!upVote;

  const isVisible = !!req.user && req.user != user._id;

  res.send({
    success: true,
    data: {
      username: user.username,
      createdAt: user.createdAt,
      image: user.image,
      userRank,
      profileUpVotes,
      memesCreated,
      commentsCreated,
      isVisible,
      isUpVoted,
    },
  });
};
