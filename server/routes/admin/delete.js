const Meme = require("../../models/Meme");
const { isValidObjectId } = require("mongoose");

module.exports = async (req, res, next) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) return next();

  const meme = await Meme.findOneAndDelete({ _id: id });
  if (!meme) return res.send({ error: "Nie znaleziono mema!" });

  res.send({ success: true, message: "Mem pomyśnie został ukryty!" });
};
