import path from 'path';
import AppError from '../interfaces/AppError.js';
import Rooms from '../db/rooms.js';
import roomsModel from '../db/rooms.js';

export const getAllUserRooms = async (req, res, next) => {
  try {
    const user_id = req.params.user_id;
    const allUserRooms = await Rooms.find({ user_id }).exec();
    return res.status(200).json({
      status: 'success',
      rooms: allUserRooms,
    });
  } catch (e) {
    next(e);
    return;
  }
};

export const associateAUserToRoom = async (req, res, next) => {
  try {
    const { chat_room_id, user_id } = req.body;
    const allUserRooms = await Rooms.find({
      user_id,
      chat_room_id: chat_room_id.replace(' ', ''),
    }).exec();
    if (allUserRooms.length > 0) {
      res.status(200).json({
        status: 'success',
        message: 'User has already been associated',
      });
    }
    const newRoom = new roomsModel({
      chat_room_id: chat_room_id.replace(' ', ''),
      user_id,
    });
    await newRoom.save();
    return res.status(200).json({
      status: 'success',
      message: 'User has been associated to a room',
    });
  } catch (e) {
    next(e);
    return;
  }
};

export const searchRooms = async (req, res, next) => {
  try {
    const searchTerm = req.params.searchterm;
    const searchResult = await Rooms.find({
      chat_room_id: { $regex: '.*' + searchTerm + '.*' },
    })
      .sort('-date')
      .limit(50);

    return res.status(200).json({ status: 'success', searchResult });
  } catch (e) {
    next(e);
    return;
  }
};

export default {
  searchRooms,
  associateAUserToRoom,
  getAllUserRooms,
};
