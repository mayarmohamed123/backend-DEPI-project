const Post = require("../models/posts.model");
const asyncWrapper = require("../middleware/asyncWrapper");
const appError = require("../utils/appError");
const httpStatusText = require("../utils/httpStatusText");

// Create Post
exports.createPost = asyncWrapper(async (req, res, next) => {
  const { title, content } = req.body;
  const post = await Post.create({ title, content, user: req.currentUser.id });

  res.status(201).json({ status: httpStatusText.SUCCESS, data: { post } });
});

// Get All Posts
exports.getAllPosts = asyncWrapper(async (req, res, next) => {
  const posts = await Post.find()
    .populate("user", "firstName lastName")
    .populate("comments");
  res.status(200).json({ status: httpStatusText.SUCCESS, data: { posts } });
});
