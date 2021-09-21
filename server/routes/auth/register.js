const bcrypt = require("bcrypt");
const User = require("../../models/User");
const validateRegistration = require("../../validation/registration");

module.exports = async (req, res) => {
  const { error } = validateRegistration(req.body);

  let err = {};
  if (error) {
    error.details.forEach((e) => {
      err = { ...err, [e.path[0]]: e.message };
    });
  }
  const { username, password, email } = req.body;

  if (!err.username) {
    const usernameExist = await User.findOne({
      username: new RegExp(`^${username}$`, "i"),
    });

    if (usernameExist)
      err = { ...err, username: "Ta nazwa użytkonika jest zajęta!" };
  }

  if (!err.email) {
    const emailExist = await User.findOne({
      email: new RegExp(`^${email}$`, "i"),
    });

    if (emailExist) err = { ...err, email: "Ten email jest już zajęty!" };
  }
  if (Object.keys(err).length) return res.send({ error: err });

  const hash = await bcrypt.hash(password, 10);
  const user = new User({
    username,
    password: hash,
    email,
  });

  await user.save();

  res.send({ success: true });
};
