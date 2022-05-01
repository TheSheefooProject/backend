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
      default:
        'https://t3.ftcdn.net/jpg/03/46/83/96/360_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg',
    },
    user_bio: {
      type: String,
      default: 'Hello world!',
    },
    reset_verification_code: {
      value1: {
        type: Number,
      },
      value2: {
        type: Number,
      },
      value3: {
        type: Number,
      },
      value4: {
        type: Number,
      },
      value5: {
        type: Number,
      },
      value6: {
        type: Number,
      },
      expiryTime: {
        type: String,
      },
      valuesString: {
        type: String,
      },
      currentAttempt: {
        type: Number,
        default: 0,
      },
      expired: {
        type: Boolean,
        default: false,
      },
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
