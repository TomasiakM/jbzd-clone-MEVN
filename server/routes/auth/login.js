const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const Meme = require("../../models/Meme");
const Comment = require("../../models/Comment");

const login = async (req, res) => {
  const { username, password, remember } = req.body;
  const { error } = validateLogin({ username, password });
  if (error) {
    let err = {};
    error.details.forEach((e) => {
      err = { ...err, [e.path[0]]: e.message };
    });

    return res.send({ error: err });
  }

  const user = await User.findOne({
    $or: [
      { username: new RegExp(`^${username}$`, "i") },
      { email: new RegExp(`^${username}$`, "i") },
    ],
  });

  if (!user) return res.send({ error: { form: "Błędne dane logowania!" } });

  const comparePassword = await bcrypt.compare(password, user.password);
  if (!comparePassword)
    return res.send({ error: { form: "Błędne dane logowania!" } });

  const token = generateToken(user, remember);

  const userComments = await Comment.find({ author: user._id });
  const userMemes = await Meme.find({ author: user._id });

  const userData = {
    username: user.username,
    createdAt: user.createdAt,
    image: user.image,
    comments: userComments.length,
    memesCreated: userMemes.length,
    accountType: user.accountType,
  };

  res.send({ success: true, token, userData });
};

const validateLogin = (data) => {
  const validationSchema = Joi.object({
    username: Joi.string().min(3).max(24).required().messages({
      "string.empty": "Nazwa użytkownika jest wymagana!",
      "string.min": "Minimum 3 znaki!",
      "string.max": "Maksymalnie 24 znaki!",
    }),
    password: Joi.string().min(7).max(24).required().messages({
      "string.empty": "Hasło jest wymagane!",
      "string.min": "Minimum 7 znaków!",
      "string.max": "Maksymalnie 24 znaki!",
    }),
  });

  return validationSchema.validate(data, { abortEarly: false });
};

const generateToken = (user, remember) => {
  return jwt.sign(
    { _id: user._id, accountType: user.accountType },
    process.env.SECRET_TOKEN,
    {
      expiresIn: remember ? "14d" : "8h",
    }
  );
};
module.exports = login;
