import express from 'express';
import postsRepliesController from '../controllers/postRepliesController';
const postsRepliesRouter = express.Router();

postsRepliesRouter
  .route('/:post_id')
  .get(postsRepliesController.getPostReplies)
  .post(postsRepliesController.createPostReply);

postsRepliesRouter
  .route('/:post_reply_id')
  .get(postsRepliesController.getPostReplybyID)
  .patch(postsRepliesController.modifyPostReply)
  .delete(postsRepliesController.deletePostReply);
export default postsRepliesRouter;
