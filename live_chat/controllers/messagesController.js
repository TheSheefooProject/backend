import path from 'path';
import AppError from '../interfaces/AppError.js';
import Message from '../db/messages.js';
import messageModel from '../db/messages.js';

export const getAllRoomMessages = async (req, res, next) => {
  try {
    const chat_room_id = req.params.chat_room_id.replace(' ', '');
    const allChatMessages = await Message.find({ chat_room_id }).sort().exec();
    return res.status(200).json({
      status: 'success',
      messages: allChatMessages,
    });
  } catch (e) {
    next(e);
    return;
  }
};

export const createANewMessage = async (req, res, next) => {
  try {
    const { chat_room_id, user_id, user_name, message } = req.body;

    const newMessage = new messageModel({
      chat_room_id: chat_room_id.replace(' ', ''),
      user_id,
      user_name,
      message,
    });
    await newMessage.save();
    return res.status(200).json({
      status: 'success',
      message: 'Message Saved',
    });
  } catch (e) {
    next(e);
    return;
  }
};

export default {
  getAllRoomMessages,
  createANewMessage,
};
