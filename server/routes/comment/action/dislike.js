const Comment = require("../../../models/Comment");

module.exports = async (req, res, next) => {
  const { id } = req.params;

  const comment = await Comment.findById(id);
  if (!comment) return next();

  const exist = comment.points.find((e) => e.user == req.user);

  if (!exist) comment.points.push({ user: req.user, vote: -1 });
  else {
    if (exist.vote == -1) exist.vote = 0;
    else exist.vote = -1;
  }

  const isUpVoted = false;
  const isDownVoted = !exist ? true : exist.vote === -1;
  const points = comment.points.reduce((points, e) => points + e.vote, 0);

  await comment.save();

  res.send({ success: true, points, isUpVoted, isDownVoted });
};
