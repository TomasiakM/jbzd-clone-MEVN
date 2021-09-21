const getMemes = require("../../scripts/getMemes");

module.exports = async (req, res, next) => {
  const { username, page } = req.params;
  if (!/^[0-9]+/.test(page)) return next();

  if (!req.user) {
    return res.send({ error: "Dostęp dla zalogowanych!" });
  }

  const query = [
    {
      $match: {
        "author.username": username,
      },
    },
  ];

  const memes = await getMemes(query, page, req.user);

  if (!memes) return next();

  res.send(memes);
};
