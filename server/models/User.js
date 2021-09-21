const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    min: 3,
    max: 24,
    require: true,
  },
  password: {
    type: String,
    max: 2048,
    required: true,
  },
  email: {
    type: String,
    max: 255,
    required: true,
  },
  accountType: {
    type: String,
    default: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  image: {
    type: String,
    default: "default.jpg",
  },
  profileUpVotes: [{ user: { type: Schema.Types.ObjectId } }],
});

module.exports = mongoose.model("User", userSchema);
