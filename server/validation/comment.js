const Joi = require("joi");

module.exports = ({ message }) => {
  const validationSchema = Joi.object({
    message: Joi.string().min(3).max(4000).required().messages({
      "string.empty": "Minimum 3 znaki!",
      "string.min": "Minimum 3 znaki!",
      "string.max": "Maksymalnie 4000 znaków!",
    }),
  });

  return validationSchema.validate({ message }, { abortEarly: false });
};
