const User = require("../../models/User");
const Meme = require("../../models/Meme");
const Comment = require("../../models/Comment");

const login = async (req, res) => {
  const user = await User.findById(req.user);

  const { createdAt, image, username, accountType } = user;

  const memes = await Meme.find({ author: user._id });
  const comments = await Comment.find({ author: user._id });

  res.send({
    userData: {
      createdAt,
      image,
      comments: comments.length,
      memesCreated: memes.length,
      username,
      accountType,
    },
  });
};

module.exports = login;
