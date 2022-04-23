import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const postReplySchema = new Schema(
  {
    author: {
      type: String,
    },

    reply_content: {
      type: String,
    },
    timestamp: {
      type: Date,
    },
    post_id: {
      type: String,
    },
  },
  { timestamps: true, id: true },
);

const postReplyModel = mongoose.model('post_replies', postReplySchema);
export default postReplyModel;
