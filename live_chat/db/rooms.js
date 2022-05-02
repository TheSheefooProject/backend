import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const roomSchema = new Schema(
  {
    chat_room_id: {
      type: String,
      required: true,
    },
    user_id: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, id: true }
);
roomSchema.index({ chat_room_id: 'text' });
const roomsModel = mongoose.model('Rooms', roomSchema);
export default roomsModel;
