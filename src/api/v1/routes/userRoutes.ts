import express from 'express';
import {
  associateOrgEmailToUser,
  checkUsernameExists,
  getUserDetails,
  updateUserDetails,
  deleteUser,
} from '../controllers/userController';
import { requireAuthenticatedUser } from '../middleware/requireAuthenticatedUser';

const userRouter = express.Router();
userRouter
  .route('/org')
  .post(requireAuthenticatedUser, associateOrgEmailToUser);

userRouter.route('/:username').get(checkUsernameExists);

userRouter
  .route('/')
  .get(requireAuthenticatedUser, getUserDetails)
  .delete(requireAuthenticatedUser, deleteUser)
  .patch(requireAuthenticatedUser, updateUserDetails);

export default userRouter;
