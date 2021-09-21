const Joi = require("joi");

module.exports = ({ username, password, confirm_password, email }) => {
  const validationSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(24).required().messages({
      "string.empty": "Nazwa użytkownika jest wymagana!",
      "string.min": "Minimum 3 znaki!",
      "string.max": "Maksymalnie 24 znaki!",
      "string.alphanum": "Dozwolone są tylko litery i liczby!",
    }),
    password: Joi.string()
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
    confirm_password: Joi.any().equal(Joi.ref("password")).required().messages({
      "string.empty": "Powtórz hasło!",
      "any.only": "Hasła się nie zagadzają!",
    }),
    email: Joi.string().email().required().messages({
      "string.email": "Podaj poprawny email!",
      "string.empty": "Email jest wymagany!",
    }),
  });

  return validationSchema.validate(
    { username, password, confirm_password, email },
    { abortEarly: false }
  );
};
