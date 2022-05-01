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
    full_name: {
      type: String,
      required: true,
    },
    profile_pic_url: {
      type: String,
    },
    reset_verification_code: {
      type: Array,
    },
    session_id: {
      type: Number,
      default: 0,
    },
    session_valid: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, id: true },
);

const userModel = mongoose.model('User', userSchema);
export default userModel;
