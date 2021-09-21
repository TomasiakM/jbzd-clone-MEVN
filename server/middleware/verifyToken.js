const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.header("Authorization").split(" ")[1];

  if (!token)
    return res
      .status(401)
      .send({ auth: false, message: "Dostęp tylko dla zalogowanych!" });

  jwt.verify(token, process.env.SECRET_TOKEN, (err, user) => {
    if (err)
      return res.status(403).send({ auth: false, message: "Odmowa dostępu!" });

    req.user = user._id;
    next();
  });
};

module.exports = verifyToken;
