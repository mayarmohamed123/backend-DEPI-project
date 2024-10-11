const express = require("express");
const router = express.Router();
const postsController = require("../controllers/posts.controller");
const verifyToken = require("../middleware/verfiyToken");

// Post Routes
router
  .route("/")
  .get(verifyToken, postsController.getAllPosts)
  .post(verifyToken, postsController.createPost);

module.exports = router;
