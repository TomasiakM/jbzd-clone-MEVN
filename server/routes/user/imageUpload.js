const multer = require("multer");
const User = require("../../models/User");
const mongoose = require("mongoose");
const { GridFsStorage } = require("multer-gridfs-storage");

const storage = new GridFsStorage({
  url: process.env.DB_CONNECT,
  file: (req, file) => {
    return {
      filename: `${mongoose.Types.ObjectId()}.${file.mimetype.split("/")[1]}`,
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
    const acceptableTypes = ["image/png", "image/jpg", "image/jpeg"];

    if (!acceptableTypes.includes(file.mimetype)) {
      req.validationError = {
        file: "Dozwolone są jedynie pliki z rozszerzeniem: .jpg, .jpeg, .png!",
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
          file: "Plik maksymalnie może ważyć 4MB!",
        };
      }
    }

    if (req.validationError) return res.send({ error: req.validationError });

    const user = await User.findById(req.user);
    user.image = req.file.filename;

    await user.save();

    res.send({ success: true, image: req.file.filename });
  });
};
