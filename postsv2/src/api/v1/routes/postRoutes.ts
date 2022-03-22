import express from 'express';
import postsController from '../controllers/postsController';

const postsRouter = express.Router();

postsRouter.route('/').get(postsController.getAllPosts);
postsRouter
  .route('/:post_id')
  .get(postsController.getAnIndividualPost)
  .post(postsController.createPost)
  .patch(postsController.modifyPost)
  .delete(postsController.deletePost);
postsRouter.route('/:titlesearch').get(postsController.searchPostByTitle);
postsRouter
  .route('/:hashtagsearch')
  .get(postsController.SearchAllPostsbyHashtag);
postsRouter.route('/:userID').get(postsController.getPostsByAnIndividual);

export default postsRouter;
