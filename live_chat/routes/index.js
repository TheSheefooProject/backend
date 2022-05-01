import express from 'express';
import globalErrorHandler from '../middleware/globalErrorHandler.js';
import messagesRouter from './messages.js';
import livechatRouter from './livechat.js';

const apiV1Router = express.Router();

apiV1Router.use('/messages/', messagesRouter);
apiV1Router.use('/livechat/', livechatRouter);
apiV1Router.use(globalErrorHandler);

export default apiV1Router;
