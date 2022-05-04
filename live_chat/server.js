import express from 'express';
import mongoose from 'mongoose';
import { createServer } from 'http';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import apiV1Router from './routes/index.js';
import cors from 'cors';
import {
  getUser,
  getUsersInRoom,
  removeUser,
  addUser,
} from './chatController.js';
import path from 'path';
dotenv.config();

const app = express();

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

app.use(express.json());
app.use(cors());
app.use('/v1', apiV1Router);

// Static code for testing
app.use(express.static(path.join('./', 'public')));

io.on('connect', (socket) => {
  socket.on('join', ({ name, room, user_id }, callback) => {
    console.log(name, room, user_id);
    const { error, user } = addUser({ id: socket.id, name, room, user_id });

    if (error) return callback(error);

    socket.join(user.room);

    io.to(user.room).emit('roomData', {
      room: user.room,
      users: getUsersInRoom(user.room),
    });

    callback();
  });

  socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket.id);
    io.to(user.room).emit('message', {
      id: user.user_id,
      user_name: user.name,
      message,
    });
    callback();
  });

  socket.on('disconnect_user', () => {
    const user = removeUser(socket.id);
    if (user) {
      // io.to(user.room).emit('message', { user: 'Admin', text: `${user.name} has left.` });
      io.to(user.room).emit('roomData', {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    }
  });
});
// Below code actually startup the server
mongoose
  .connect('mongodb://localhost:27020/live-chat-db')
  .then(() => {
    console.log('Database connection made');
    server.listen(process.env.NODE_PORT || 3005, () => {
      console.log(
        'App is running at http://localhost:%d in %s mode',
        process.env.NODE_PORT,
        process.env.NODE_ENV
      );
      console.log('Press CTRL-C to stop\n');
    });
  })
  .catch((e) => {
    console.error(
      'Database connection failed, api has failed to start. Error:',
      e
    );
  });
