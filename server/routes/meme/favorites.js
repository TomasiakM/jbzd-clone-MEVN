const getMemes = require("../../scripts/getMemes");
const mongoose = require("mongoose");

module.exports = async (req, res, next) => {
  const { page } = req.params;
  if (!/^[0-9]+/.test(page)) return next();

  const query = [
    {
      $match: {
        "favoritesList.user": mongoose.Types.ObjectId(req.user),
      },
    },
    {
      $addFields: {
        favoriteFrom: {
          $filter: {
            input: "$favoritesList",
            as: "el",
            cond: { $eq: ["$$el.user", mongoose.Types.ObjectId(req.user)] },
          },
        },
      },
    },
    {
      $addFields: {
        favoriteFrom: { $arrayElemAt: ["$favoriteFrom.addedAt", 0] },
      },
    },
  ];

  const options = {
    sort: {
      favoriteFrom: -1,
    },
  };

  const memes = await getMemes(query, page, req.user, options);

  if (!memes) return next();

  res.send(memes);
};
