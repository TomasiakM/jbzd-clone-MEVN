const Joi = require("joi");

const validateMeme = ({ title, description, tags }) => {
  const validationSchema = Joi.object({
    title: Joi.string().min(3).max(255).required().messages({
      "string.empty": "Tytuł jest wymagany!",
      "string.min": "Minimum 3 znaki!",
      "string.max": "Maksymalnie 255 znaków!",
    }),
    description: Joi.string().allow("").min(3).max(4000).messages({
      "string.min": "Minimum 3 znaki!",
      "string.max": "Maksymalnie 4000 znaków!",
    }),
    tags: Joi.array()
      .items(
        Joi.string().alphanum().min(3).max(25).messages({
          "string.alphanum": "Dozwolone są tylko litery i liczby w tagach!",
          "string.min": "Minimum 3 znaki w tagu!",
          "string.max": "Maksymalnie 25 znaków w tagu!",
        })
      )
      .unique((a, b) => a == b)
      .max(5)
      .messages({
        "array.max": "Maksymalnie możesz dodać 5 tagów!",
        "array.unique": "Tagi nie mogą się powtarzać!",
      }),
  });

  return validationSchema.validate(
    { title, description, tags },
    { abortEarly: false }
  );
};

module.exports = validateMeme;
