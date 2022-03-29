// Note that this is the global router, for api v1
import express from 'express';
import userRoutes from './userRoutes';
import authRoutes from './authRoutes';
import postsRoutes from './postRoutes';
import postsRepliesRoutes from './postRepliesRoutes';
import globalErrorHandler from '../middleware/globalErrorHandler';
import deserializeUser from '../middleware/deserializeUser';

const apiV1Router = express.Router();
apiV1Router.use(deserializeUser);

apiV1Router.use('/auth/', authRoutes);
apiV1Router.use('/user/', userRoutes);
apiV1Router.use('/posts/', postsRoutes);
apiV1Router.use('/postsReplies/', postsRepliesRoutes);
apiV1Router.use(globalErrorHandler);
export default apiV1Router;
