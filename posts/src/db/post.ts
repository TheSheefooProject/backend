import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    author: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    time_created: {
      type: Date,
      default: Date.now,
    },
    first_hashtag: {
      type: String,
      required: true,
    },
    second_hashtag: {
      type: String,
      required: false,
    },
    third_hashtag: {
      type: String,
      required: false,
    },
    image_url: {
      type: String,
    },
  },
  { timestamps: true, id: true },
);

const postModel = mongoose.model('posts', postSchema);
export default postModel;
