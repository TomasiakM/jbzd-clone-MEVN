const Comment = require("../../models/Comment");
const Meme = require("../../models/Meme");
const getComments = require("../../scripts/getComments");
const validate = require("../../validation/comment");

module.exports = async (req, res, next) => {
  const { message, meme, replyTo } = req.body;

  const { error } = validate({ message });

  if (error) {
    return res.send({ error: error.details[0].message });
  }

  const memeExists = await Meme.findById(meme);
  if (!memeExists) return next();

  const comment = new Comment({
    author: req.user,
    message,
    meme,
    replyTo,
  });

  await comment.save();

  const comments = await getComments(memeExists._id, req.user);

  res.send({ comments });
};
