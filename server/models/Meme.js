const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
var aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const { Schema } = mongoose;

const memeSchema = new Schema({
  url: {
    type: String,
    default: null,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  title: {
    type: String,
    min: 3,
    max: 255,
    required: true,
  },
  description: {
    type: String,
    max: 4096,
    default: null,
  },
  upVotes: [{ user: { type: Schema.Types.ObjectId } }],
  favoritesList: [
    {
      user: { type: Schema.Types.ObjectId },
      addedAt: { type: Date, default: Date.now },
    },
  ],
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    default: null,
  },
  isForAdults: {
    type: Boolean,
    default: false,
  },
  isOnMainPage: {
    type: Boolean,
    default: false,
  },
  isOnMainPageFrom: {
    type: Date,
    default: null,
  },
  tags: {
    type: Array,
    default: [],
  },
});

memeSchema.plugin(mongoosePaginate);
memeSchema.plugin(aggregatePaginate);

module.exports = mongoose.model("Meme", memeSchema);
