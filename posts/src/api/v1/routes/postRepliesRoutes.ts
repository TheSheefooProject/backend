import express from 'express';
import postsRepliesController from '../controllers/postRepliesController';
import { requireAuthenticatedUser } from '../middleware/requireAuthenticatedUser';

const postsRepliesRouter = express.Router();
postsRepliesRouter
  .route('/postreply/:post_reply_id')
  .get(postsRepliesController.getPostReplybyID)
  .patch(requireAuthenticatedUser, postsRepliesController.modifyPostReply)
  .delete(requireAuthenticatedUser, postsRepliesController.deletePostReply);

postsRepliesRouter
  .route('/:post_id')
  .get(postsRepliesController.getPostReplies)
  .post(requireAuthenticatedUser, postsRepliesController.createPostReply);

export default postsRepliesRouter;
