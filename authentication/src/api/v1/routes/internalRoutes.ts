import express from 'express';
import internalController from '../controllers/internalController';
const authRouter = express.Router();

authRouter.route('/verify').get(internalController.verifyUserAuthentication);

export default authRouter;
