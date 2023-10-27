import express from "express";
import {
  deleteUser,
  dislike,
  getUser,
  like,
  subscribe,
  unsubscribe,
  update,
} from "../controllers/user.js";
import { verifyToken } from "../verifyToken.js";
const router = express.Router();

//UPDATE
router.put("/:id", verifyToken, update);

//DELETE
router.delete("/:id", verifyToken, deleteUser);

//GET USER
router.get("/find/:id", getUser);

//SUBSCRIBE A USER
router.put("/sub/:id", verifyToken, subscribe);

//UNSUBS A USER
router.put("/unsub/:id", verifyToken, unsubscribe);

//LIKE VIDEO
router.put("/like/:videoId", verifyToken, like);

// DISLIKE VIDEO
router.put("/dislike/:videoId", verifyToken, dislike);

export default router;
