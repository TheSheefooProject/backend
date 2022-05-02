import express from 'express';
import messagesController from '../controllers/messagesController.js';
const messagesRoutes = express.Router();

messagesRoutes
  .route('/:chat_room_id')
  .get(messagesController.getAllRoomMessages);

messagesRoutes.route('/').post(messagesController.createANewMessage);

export default messagesRoutes;
