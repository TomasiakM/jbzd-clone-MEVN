const getComments = require("./getComments");

const convertMeme = async (meme, userID) => {
  const comments = await getComments(meme._id, userID);

  meme.comments = comments;
  meme.isLiked = false;
  meme.isFavorite = false;

  if (userID) {
    const upVoteIndex = meme.upVotes.findIndex((e) => e.user == userID);
    if (upVoteIndex >= 0) meme.isLiked = true;

    const favoriteIndex = meme.favoritesList.findIndex((e) => e.user == userID);
    if (favoriteIndex >= 0) meme.isFavorite = true;
  }

  delete meme.favoritesList;
  meme.category;
  meme.upVotes = meme.upVotes.length;
  meme.accountType = meme.author.accountType;
  meme.author = meme.author.username;

  return meme;
};

module.exports = convertMeme;
