const createError = require("http-errors");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const Grid = require("gridfs-stream");
const express = require("express");
const app = express();

const dotenv = require("dotenv");
dotenv.config();

app.use(cors());
app.use(express.json());

app.use(express.static(__dirname + "/public"));

app.use(express.static("public"));

mongoose
  .connect(process.env.DB_CONNECT, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => console.log("MongoDB Connected!"))
  .catch((err) => {
    console.log("MongoDB error: ", err);
  });

//---------------------- images stream
const conn = mongoose.connection;
let gfs, gridFSBucket;

conn.once("open", () => {
  gridFSBucket = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "images",
  });
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("images");
});

const createGridFSReadStream = (id) => {
  return gridFSBucket.openDownloadStream(mongoose.Types.ObjectId(id));
};

app.get("/api/image/:name", async (req, res, next) => {
  gfs.files.findOne({ filename: req.params.name }, (err, file) => {
    if (!file) return next();

    res.setHeader("content-type", file.contentType);
    const readStream = createGridFSReadStream(file._id);
    readStream.pipe(res);
  });
});
//----------------------------------------------

const authRoute = require("./routes/auth");
const memeRoute = require("./routes/meme");
const categoryRoute = require("./routes/category");
const userRoute = require("./routes/user");
const commentRoute = require("./routes/comment");
const adminRoute = require("./routes/admin");

app.use("/api/auth/", authRoute);
app.use("/api/meme/", memeRoute);
app.get("/api/category", categoryRoute);
app.use("/api/user", userRoute);
app.use("/api/comment", commentRoute);
app.use("/api/admin", adminRoute);

app.use("/api/*", (req, res, next) => {
  next(createError(404));
});

app.get("*", (req, res, next) => {
  res.sendFile(path.resolve("public", "index.html"));
});

app.use((error, req, res, next) => {
  if (error.statusCode === 404) {
    return res.status(404).send({ isNotFound: true });
  }

  return res
    .status(error.statusCode || 500)
    .json({ error: error.toString() || "Coś poszło nie tak..." });
});

app.listen(process.env.PORT, () =>
  console.log(`Server is started on port ${process.env.PORT}!`)
);
