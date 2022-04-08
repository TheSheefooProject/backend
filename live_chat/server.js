import express from 'express';
import mongoose from 'mongoose';
import { createServer } from 'http';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import path from 'path';
dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server);

// Static code for testing
app.use(express.static(path.join('./', 'public')));

io.on('connection', (socket) => {
  console.log('New Ws Connection');
  console.log(socket.request.headers);
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
