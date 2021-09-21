const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const { Schema } = mongoose;

const commentSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  message: {
    type: String,
    max: 4000,
    min: 3,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  meme: {
    type: Schema.Types.ObjectId,
    ref: "Meme",
    default: null,
  },
  replyTo: {
    type: Schema.Types.ObjectId,
    ref: "Comment",
    default: null,
  },
  points: [
    {
      user: { type: Schema.Types.ObjectId },
      vote: { type: Number, required: true },
    },
  ],
});

commentSchema.plugin(aggregatePaginate);
commentSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Comment", commentSchema);
