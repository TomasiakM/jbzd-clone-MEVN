const getMemes = require("../../scripts/getMemes");
const Category = require("../../models/Category");

module.exports = async (req, res, next) => {
  const { category, page } = req.params;
  if (!/^[0-9]+/.test(page)) {
    return next();
  }

  const cat = await Category.findOne({ urlName: category });
  if (!cat || cat.isForAuthUser) return next();

  const query = [{ $match: { "category._id": cat._id } }];
  if (!req.user) query[0].$match.isOnMainPage = true;
  const memes = await getMemes(query, page, req.user);

  if (!memes) return next();
  res.send(memes);
};
