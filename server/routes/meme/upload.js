const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const Meme = require("../../models/Meme");
const Category = require("../../models/Category");
const validateMeme = require("../../validation/uploadMeme");
const { GridFsStorage } = require("multer-gridfs-storage");

const storage = new GridFsStorage({
  url: process.env.DB_CONNECT,
  file: (req, file) => {
    return {
      filename: `${mongoose.Types.ObjectId()}${path.extname(
        file.originalname
      )}`,
      bucketName: "images",
    };
  },
  options: {
    useUnifiedTopology: true,
  },
});

const single = multer({
  storage: storage,
  fileFilter: async (req, file, cb) => {
    const ext = path.extname(file.originalname);

    const { error, values } = await validateBody(req, file);
    if (Object.keys(error).length) {
      req.validationError = error;
    }
    if (Object.keys(values).length) {
      req.values = values;
    }
    if (!(ext == ".jpg" || ext == ".jpeg" || ext == ".png" || ext == ".gif")) {
      req.validationError = {
        ...req.validationError,
        file: "Dozwolone są jedynie pliki z rozszerzeniem: .jpg, .jpeg, .png, .gif!",
      };
    }

    if (req.validationError) {
      return cb(null, false);
    }
    return cb(null, true);
  },
  limits: {
    files: 1,
    fileSize: 1024 * 1024 * 4, //4MB
  },
}).single("image");

module.exports = (req, res) => {
  single(req, res, async (err) => {
    if (err && err.code == "LIMIT_FILE_SIZE") {
      if (req.validationError) {
        req.validationError = {
          ...req.validationError,
          file: "Plik maksymalnie może ważyć 4MB!",
        };
      } else {
        req.validationError = { file: "Plik maksymalnie może ważyć 4MB!" };
      }
    }

    if (!req.file && !req.validationError) {
      const { error, values } = await validateBody(req);
      if (Object.keys(error).length) {
        req.validationError = error;
      }
      req.values = values;
    }

    if (req.validationError) return res.send({ error: req.validationError });

    const { title, description, tags, category, closeCategory, isForAdults } =
      req.values;

    let meme = new Meme({
      title,
      description,
      tags,
      category,
      closeCategory,
      isForAdults,
      author: req.user,
    });

    if (req.file) {
      meme.url = req.file.filename;
    }

    try {
      await meme.save();
      res.send({ meme });
    } catch (err) {
      res.send({ error: { form: "Coś poszło nie tak spróbuj ponownie!" } });
    }
  });
};

const validateBody = async (req, file = null) => {
  let { title, description, tags, category, closeCategory, isForAdults } =
    JSON.parse(req.body.data);

  const { error, value } = validateMeme({
    title,
    description,
    tags,
  });

  const memeValues = { ...value, category, closeCategory, isForAdults };

  let err = {};
  if (error) {
    error.details.forEach((e) => {
      if (e.path[0] == "tags") {
        if (!err.tags) {
          err = { ...err, tags: [] };
        }
        err = {
          ...err,
          tags: [
            ...err.tags,
            {
              id: err.tags.length,
              value: e.context.value,
              message: e.message,
            },
          ],
        };
        return;
      }
      err = { ...err, [e.path[0]]: e.message };
    });
  }

  if (!file && !description) {
    err = {
      ...err,
      description: "Jeśli nie dodajesz obrazka opis jest wymagany!",
    };
  }

  if (category) {
    const cat = await Category.findById(category);
    if (!cat) {
      err = { ...err, categorie: "Podana kategoria nie istnieje!" };
    }
  }

  return {
    error: err,
    values: memeValues,
  };
};
