import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const messageSchema = new Schema(
  {
    chat_room_id: {
      type: String,
      required: true,
    },
    user_id: {
      type: String,
      required: true,
    },
    user_name: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, id: true }
);

const messageModel = mongoose.model('Messages', messageSchema);
export default messageModel;
