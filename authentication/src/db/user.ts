import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    verified_email: {
      type: Boolean,
      default: false,
    },
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    profile_pic_url: {
      type: String,
    },
    reset_verification_code: {
      type: Array,
    },
  },
  { timestamps: true, id: true },
);

const userModel = mongoose.model('User', userSchema);
export default userModel;
