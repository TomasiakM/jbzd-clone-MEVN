const getMemes = require("../../scripts/getMemes");

module.exports = async (req, res, next) => {
  const { tag, page } = req.params;
  if (!/^[0-9]+/.test(page)) {
    return next();
  }

  let query = [
    {
      $match: {
        tags: tag,
        $or: [{ category: [] }, { "category.isForAuthUsers": false }],
      },
    },
  ];
  if (!req.user) query = [...query, { $match: { isOnMainPage: true } }];
  const memes = await getMemes(query, page, req.user);

  if (!memes || memes.error) return next();
  res.send(memes);
};
