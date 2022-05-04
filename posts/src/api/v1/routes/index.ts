// Note that this is the global router, for api v1
import express from 'express';
import postsRoutes from './postRoutes';
import postsRepliesRoutes from './postRepliesRoutes';
import globalErrorHandler from '../middleware/globalErrorHandler';

const apiV1Router = express.Router();

apiV1Router.use('/posts/', postsRoutes);
apiV1Router.use('/postsReplies/', postsRepliesRoutes);
apiV1Router.use(globalErrorHandler);
export default apiV1Router;
