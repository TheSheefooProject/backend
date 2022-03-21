import express from 'express';
import authController from '../controllers/authController';
const authRouter = express.Router();

authRouter.route('/register').post(authController.register);

authRouter.route('/login').post(authController.login);

authRouter.route('/verifyemail/:token').get(authController.verifyEmail);

authRouter.route('/logout').post(authController.logoutUser);

authRouter
  .route('/forgotpassword')
  .post(authController.forgotPasswordEmailGeneration)
  .patch(authController.verifyForgottenPassword);

export default authRouter;
