import express from 'express';
import postsController from '../controllers/postsController';
import { requireAuthenticatedUser } from '../middleware/requireAuthenticatedUser';

const postsRouter = express.Router();

postsRouter
  .route('/')
  .get(postsController.getAllPosts)
  .post(requireAuthenticatedUser, postsController.createPost);

postsRouter
  .route('/:post_id')
  .get(postsController.getAnIndividualPost)
  .patch(requireAuthenticatedUser, postsController.modifyPost)
  .delete(requireAuthenticatedUser, postsController.deletePost);
postsRouter.route('/:titleSearch').get(postsController.searchPostByTitle);
postsRouter
  .route('/hashtag/:search')
  .get(postsController.SearchAllPostsbyHashtag);
postsRouter.route('/:userID').get(postsController.getPostsByAnIndividual);

export default postsRouter;
