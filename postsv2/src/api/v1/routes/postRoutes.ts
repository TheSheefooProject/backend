import express from 'express';
import postsController from '../controllers/postsController';

const postsRouter = express.Router();

postsRouter.route('/all').get(postsController.getAllPosts);

export default postsRouter;
