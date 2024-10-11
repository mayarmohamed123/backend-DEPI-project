const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/verfiyToken");
const commentsController = require("../controllers/comments.controller");

// Comment Routes
router
  .route("/:postId")
  .get(commentsController.getCommentsByPost)
  .post(verifyToken, commentsController.createComment);

module.exports = router;
