const User = require("../../models/User");

module.exports = async (req, res, next) => {
  const { username } = req.params;
  const user = await User.findOne({ username });

  if (req.user == user._id)
    return res.send({ error: "Nie możesz polubić swojego profilu!" });

  const likeIndex = user.profileUpVotes.findIndex((e) => e.user == req.user);

  let isUpVoted = true;
  if (likeIndex < 0) user.profileUpVotes.push({ user: req.user });
  else {
    const filter = user.profileUpVotes.filter((e) => e.user != req.user);
    user.profileUpVotes = filter;
    isUpVoted = false;
  }

  await user.save();

  const profileUpVotes = user.profileUpVotes.length;

  const users = await User.find({})
    .sort({ profileUpVotes: -1, createdAt: 1 })
    .lean();
  const userRank = users.findIndex((e) => e._id.equals(user._id)) + 1;

  res.send({ success: true, profileUpVotes, userRank, isUpVoted });
};
