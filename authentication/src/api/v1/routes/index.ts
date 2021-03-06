// Note that this is the global router, for api v1
import express from 'express';
import userRoutes from './userRoutes';
import authRoutes from './authRoutes';
import internalRoutes from './internalRoutes';
import globalErrorHandler from '../middleware/globalErrorHandler';
import deserializeUser from '../middleware/deserializeUser';

const apiV1Router = express.Router();
apiV1Router.use('/internal/', internalRoutes);
apiV1Router.use(deserializeUser);

apiV1Router.use('/auth/', authRoutes);
apiV1Router.use('/user/', userRoutes);
apiV1Router.use(globalErrorHandler);
export default apiV1Router;
