import express from "express";
import { addComment, delComment, getComments } from "../controllers/comment.js";
const router = express.Router();
import { verifyToken } from "../verifyToken.js";

router.post("/", verifyToken, addComment);
router.delete("/:id", verifyToken, delComment);
router.get("/:videoId", getComments);

export default router;
