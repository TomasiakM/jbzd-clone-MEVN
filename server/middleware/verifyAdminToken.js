const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.header("Authorization").split(" ")[1];

  if (!token)
    return res
      .status(401)
      .send({ auth: false, message: "Dostęp tylko dla administracji!" });

  jwt.verify(token, process.env.SECRET_TOKEN, (err, user) => {
    if (err)
      return res.status(403).send({ auth: false, message: "Odmowa dostępu!" });

    if (user.accountType != "Admin")
      return res.status(403).send({ error: "Dostęp tylko dla administracji!" });
    req.user = user._id;
    next();
  });
};

module.exports = verifyToken;
