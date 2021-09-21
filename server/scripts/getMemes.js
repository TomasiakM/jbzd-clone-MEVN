const Meme = require("../models/Meme");
const convertMeme = require("./convertMeme");

const perPage = 8;

const getMemes = async (query, page, userID, options = {}) => {
  options = {
    lean: true,
    page: Number(page) + 1,
    limit: perPage,
    sort: { createdAt: -1 },
    ...options,
  };

  query = Meme.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "author",
        foreignField: "_id",
        as: "author",
      },
    },
    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "category",
      },
    },
    ...query,
    {
      $addFields: {
        author: { $arrayElemAt: ["$author", 0] },
        category: {
          $ifNull: [
            {
              $arrayElemAt: ["$category", 0],
            },
            null,
          ],
        },
      },
    },
  ]);

  const memes = await Meme.aggregatePaginate(query, options);
  if (memes.page > memes.totalPages) return;

  if (!memes.docs.length && memes.totalPages == 1)
    return { error: "Brak memów!" };

  for (let meme of memes.docs) {
    meme = await convertMeme(meme, userID);
  }

  return memes;
};

module.exports = getMemes;
