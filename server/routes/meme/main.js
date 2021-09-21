const getMemes = require("../../scripts/getMemes");

module.exports = async (req, res, next) => {
  const { page } = req.params;
  if (!/^[0-9]+/.test(page)) {
    return next();
  }
  const query = [{ $match: { isOnMainPage: true } }];
  const options = { sort: { isOnMainPageFrom: -1 } };
  const memes = await getMemes(query, page, req.user, options);

  if (!memes) return next();
  res.send(memes);
};
