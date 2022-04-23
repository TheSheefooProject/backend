import express from 'express';
import postsRepliesController from '../controllers/postRepliesController';
import { requireAuthenticatedUser } from '../middleware/requireAuthenticatedUser';

const postsRepliesRouter = express.Router();

postsRepliesRouter
  .route('/:post_id')
  .get(postsRepliesController.getPostReplies)
  .post(requireAuthenticatedUser, postsRepliesController.createPostReply);

postsRepliesRouter
  .route('/:post_reply_id')
  .get(postsRepliesController.getPostReplybyID)
  .patch(requireAuthenticatedUser, postsRepliesController.modifyPostReply)
  .delete(requireAuthenticatedUser, postsRepliesController.deletePostReply);
export default postsRepliesRouter;
