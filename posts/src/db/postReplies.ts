import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const postReplySchema = new Schema(
  {
    reply_id: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },

    reply_content: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    post_id: {
      type: String,
    },
  },
  { timestamps: true, id: true },
);

const postReplyModel = mongoose.model('post_replies', postReplySchema);
export default postReplyModel;
