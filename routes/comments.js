import express from "express";
import { isLogin } from "../middleware/isAdmin.js";
import { AddComment, GetComments } from "../controllers/comment.js";

const CommentsRoutes = express.Router();


CommentsRoutes.post(
  "/addComment",
  isLogin,
  AddComment
);


CommentsRoutes.get(
  "/:id",
  GetComments
);


export default CommentsRoutes;