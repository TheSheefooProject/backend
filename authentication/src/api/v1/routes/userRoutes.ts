import express from 'express';
import {
  checkUsernameExists,
  getUserDetails,
  getGetUserDetailsBasedOnID,
  updateUserDetails,
  deleteUser,
} from '../controllers/userController';
import { requireAuthenticatedUser } from '../middleware/requireAuthenticatedUser';

const userRouter = express.Router();

userRouter.route('/:username').get(checkUsernameExists);
userRouter.route('/userdetails/:id').get(getGetUserDetailsBasedOnID);

userRouter
  .route('/')
  .get(requireAuthenticatedUser, getUserDetails)
  .delete(requireAuthenticatedUser, deleteUser)
  .patch(requireAuthenticatedUser, updateUserDetails);

export default userRouter;
