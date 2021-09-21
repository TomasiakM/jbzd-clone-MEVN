const jwt = require("jsonwebtoken");

const verifyTokeOptional = (req, res, next) => {
  const authorization = req.header("Authorization");
  if (authorization) {
    const token = authorization.split(" ")[1];
    if (token) {
      jwt.verify(token, process.env.SECRET_TOKEN, (err, user) => {
        if (err)
          return res
            .status(403)
            .send({ auth: false, message: "Odmowa dostępu!" });

        req.user = user._id;
        next();
      });
    } else {
      next();
    }
  } else {
    res.status(403).send({ error: "Brak tokena w nagłówku!" });
  }
};

module.exports = verifyTokeOptional;
