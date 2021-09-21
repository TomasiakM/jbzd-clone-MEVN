const User = require("../../models/User");
const bcrypt = require("bcrypt");
const Joi = require("joi");

module.exports = async (req, res) => {
  const { password, newPassword } = req.body;

  const user = await User.findById(req.user);
  if (user.username == "test")
    return res.send({
      error: { form: "Użytkownikowi testowemu nie można zmienić hasła!" },
    });

  const err = {};
  const comparePassword = await bcrypt.compare(password, user.password);
  if (!comparePassword) err.password = "Błędne Hasło!";

  const { error } = validate(req.body);

  if (error) {
    const { details } = error;
    err[details[0].path[0]] = details[0].message;
  }

  if (comparePassword && password == newPassword)
    err.newPassword = "Nowe hasło nie może być aktualnie używanym hasłem!";

  if (Object.keys(err).length) return res.send({ error: err });

  const generatePass = await bcrypt.hash(newPassword, 10);
  user.password = generatePass;
  await user.save();
  res.send({ success: true });
};

const validate = ({ newPassword, confirmNewPassword }) => {
  const validationSchema = Joi.object({
    newPassword: Joi.string()
      .min(7)
      .max(24)
      .required()
      .custom((value, helper) => {
        if (value.length < 7) return value;
        const reg = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{7,}$/;

        if (!reg.test(value))
          return helper.message(
            "Hasło musi zawierać jedną liczbę, dużą i małą literę!"
          );

        return value;
      })
      .messages({
        "string.empty": "Hasło jest wymagane!",
        "string.min": "Minimum 7 znaków!",
        "string.max": "Maksymalnie 24 znaki!",
      }),
    confirmNewPassword: Joi.any()
      .equal(Joi.ref("newPassword"))
      .required()
      .messages({
        "string.empty": "Powtórz hasło!",
        "any.only": "Hasła się nie zagadzają!",
      }),
  });

  return validationSchema.validate({ newPassword, confirmNewPassword });
};
