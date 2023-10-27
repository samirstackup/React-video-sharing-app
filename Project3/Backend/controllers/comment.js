import Comment from "../models/Comment.js";
import Video from "../models/Video.js";
import { createError } from "../error.js";

export const addComment = async (req, res, next) => {
  const newComment = new Comment({ ...req.body, userId: req.user.id });
  try {
    const savedComment = await newComment.save();
    res.status(200).send(savedComment);
  } catch (err) {
    next(err);
  }
};

export const delComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    const video = await Video.findById(req.params.id);
    if (req.userId === comment.userId || req.user.id === video.userId) {
      //if owner of comment OR video
      await Comment.findByIdAndDelete(req.params.id);
      res.status(200).json("Comment deleted");
    } else {
      return next(createError(403, "You can only delete your own video"));
    }
  } catch (err) {
    next(err);
  }
};

export const getComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ videoId: req.params.videoId }); //Find all comments,params from route
    res.status(200).json(comments);
  } catch (err) {
    next(err);
  }
};
