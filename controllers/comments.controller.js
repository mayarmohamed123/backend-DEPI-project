const Comment = require("../models/comments.model");
const asyncWrapper = require("../middleware/asyncWrapper");
const appError = require("../utils/appError");
const httpStatusText = require("../utils/httpStatusText");

// Create Comment
exports.createComment = asyncWrapper(async (req, res, next) => {
  const { content, postId } = req.body;

  const comment = await Comment.create({
    content,
    user: req.currentUser.id,
    post: postId,
  });
  res.status(201).json({ status: httpStatusText.SUCCESS, data: { comment } });
});

// Get All Comments for a Post
exports.getCommentsByPost = asyncWrapper(async (req, res, next) => {
  const { postId } = req.params;

  const comments = await Comment.find({ post: postId }).populate(
    "user",
    "firstName lastName"
  );
  res.status(200).json({ status: httpStatusText.SUCCESS, data: { comments } });
});
