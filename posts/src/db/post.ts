import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    author: {
      type: String,
    },
    title: {
      type: String,
    },
    content: {
      type: String,
    },
    time_created: {
      type: Date,
    },
    first_hashtag: {
      type: String,
    },
    second_hashtag: {
      type: String,
    },
    third_hashtag: {
      type: String,
    },
    image_url: {
      type: String,
    },
  },
  { timestamps: true, id: true },
);

const postModel = mongoose.model('posts', postSchema);
export default postModel;
