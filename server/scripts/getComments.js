const Comment = require("../models/Comment");
const mongoose = require("mongoose");

const getComments = async (memeID, userID = null) => {
  const commentsList = await Comment.aggregate([
    {
      $match: { meme: memeID },
    },
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
      $addFields: {
        user: {
          $filter: {
            input: "$points",
            as: "e",
            cond: { $eq: ["$$e.user", mongoose.Types.ObjectId(userID)] },
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
            { $eq: ["$user.user", mongoose.Types.ObjectId(userID)] },
            { $eq: ["$user.vote", 1] },
          ],
        },
        isDownVoted: {
          $and: [
            { $eq: ["$user.user", mongoose.Types.ObjectId(userID)] },
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

  const comments = commentsList.filter((e) => e.replyTo == null);

  comments.forEach((comment) => {
    const replies = commentsList.filter((e) => {
      if (e.replyTo == null) return false;
      return e.replyTo.equals(comment._id);
    });
    comment.replies = replies;
  });

  return comments;
};

module.exports = getComments;
