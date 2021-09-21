const Comment = require("../../models/Comment");
const Types = require("mongoose").Types;

module.exports = async (req, res, next) => {
  const { username, page } = req.params;
  const { sort = "date" } = req.query;

  if (!/^[0-9]+/.test(page)) {
    return next();
  }

  const query = Comment.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "author",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $addFields: {
        username: { $arrayElemAt: ["$user.username", 0] },
        accountType: { $arrayElemAt: ["$user.accountType", 0] },
        image: { $arrayElemAt: ["$user.image", 0] },
      },
    },
    {
      $match: { username: username },
    },
    {
      $addFields: {
        user: {
          $filter: {
            input: "$points",
            as: "e",
            cond: { $eq: ["$$e.user", Types.ObjectId(req.user)] },
          },
        },
      },
    },
    {
      $addFields: {
        user: {
          $arrayElemAt: ["$user", 0],
        },
      },
    },
    {
      $addFields: {
        isUpVoted: {
          $and: [
            { $eq: ["$user.user", Types.ObjectId(req.user)] },
            { $eq: ["$user.vote", 1] },
          ],
        },
        isDownVoted: {
          $and: [
            { $eq: ["$user.user", Types.ObjectId(req.user)] },
            { $eq: ["$user.vote", -1] },
          ],
        },
        points: {
          $sum: "$points.vote",
        },
      },
    },
    {
      $project: {
        user: 0,
      },
    },
  ]);

  const options = {
    lean: true,
    page: Number(page) + 1,
    limit: 16,
    sort: sort == "date" ? { createdAt: -1 } : { points: -1 },
  };
  const comments = await Comment.aggregatePaginate(query, options);

  if (comments.page == 1 && !comments.docs.length)
    return res.send({ error: "Brak komentarzy!" });
  res.send(comments);
};
