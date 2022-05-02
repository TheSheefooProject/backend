import express from 'express';
import livechatController from '../controllers/livechatController.js';
const livechatRouter = express.Router();

livechatRouter.route('/:searchterm').get(livechatController.searchRooms);

livechatRouter.route('/room/:user_id').get(livechatController.getAllUserRooms);

livechatRouter.route('/room/').post(livechatController.associateAUserToRoom);

export default livechatRouter;
