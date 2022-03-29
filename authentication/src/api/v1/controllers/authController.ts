import bcrypt from 'bcryptjs';
import { NextFunction, Request, Response } from 'express';
import path from 'path';
import {
  ACCESS_TOKEN_UPDATE_SECONDS,
  ACCESS_TOKEN_UPDATE_TIME,
  REFRESH_TOKEN_UPDATE_SECONDS,
  REFRESH_TOKEN_UPDATE_TIME,
} from '../../../config/jwt';
import AppError from '../interfaces/AppError';
import {
  checkIfValidationCodesMatch,
  decreaseCurrentAttempt,
  extractValuesFromString,
  generateForgotEmailRandomNumbers,
  sendForgottenEmail,
  sendPasswordChangedEmail,
  updateForgotEmailVerificationCodeDB,
} from '../models/auth/forgotPasswordEmail';
import { signJWT, verifyJWT } from '../models/auth/jwt';
import {
  createUser,
  createUserSession,
  invalidateUserSession,
  updateUserPassword,
} from '../models/auth/user';
import {
  sendVerificationEmail,
  updateVerifiedEmail,
  validOrganizationEmail,
} from '../models/auth/validateEmail';
import { getUserData, getUserId } from '../models/user';
import { validateForgotPasswordValidator } from '../validators/authValidator/forogtPasswordValidator';
import { validateRegistrationFields } from '../validators/authValidator/registrationValidator';
import { validatePassword } from '../validators/userValidator/general';
/**
 * Get the servers public key
 * @route POST /register
 */
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // Below function also throws error if needed
    const { firstName, lastName, username, email, password } =
      validateRegistrationFields(req);

    const isUsernameNotUnique = await getUserId(username, 'USERNAME');
    if (isUsernameNotUnique) {
      throw new AppError('Username is taken by another account', 403);
    }

    const isEmailNotUnique = await getUserId(email, 'EMAIL');
    if (isEmailNotUnique) {
      throw new AppError('Email is already registered to another account', 403);
    }

    const userData = await createUser(
      firstName,
      lastName,
      username,
      email,
      password,
    );
    if (!userData) {
      throw new AppError(
        'Failed creating account. Ensure all provided fields are valid.',
        409,
      );
    }
    //TODO! Setup conformation email details.
    const userID = await getUserId(email, 'EMAIL');
    await sendVerificationEmail(email, req.headers.host, userID);

    res.status(200).json({
      status: 'success',
      user: {
        firstName,
        lastName,
        username,
        email,
      },
    });
  } catch (e) {
    next(e);
    return;
  }
};

/**
 * Get the servers public key
 * @route GET /login
 */
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { username, email, password } = req.body;
    if (!password || !(username || email)) {
      throw new AppError(
        'you must provide a email or username, as well as the associated password',
        403,
      );
    }
    const userIdentifier: string = email || username; //Default to email if multiple fields provided
    const userData = await getUserData(
      userIdentifier,
      userIdentifier === username ? 'USERNAME' : 'EMAIL',
    );
    if (!userData) {
      throw new AppError('Failed finding user details');
    }

    //Check if the user password is correct.
    const checkValid = await bcrypt.compare(password, userData.password);
    if (!checkValid) {
      const errorMessage = `Invalid ${
        userIdentifier === username ? 'username' : 'email'
      } or password`;
      throw new AppError(errorMessage, 401);
    }

    //We first create a session id to be passed into our refresh token, and store on db.
    const newSessionID = await createUserSession(userData.email);

    // create access token
    const accessToken = signJWT(
      {
        id: userData.id,
        email: userData.email,
        username: userData.username,
        sessionId: newSessionID,
      },
      ACCESS_TOKEN_UPDATE_TIME,
    );

    //Create the associated refresh token
    const refreshToken = signJWT(
      { sessionId: newSessionID, id: userData.id },
      REFRESH_TOKEN_UPDATE_TIME,
    );

    // //* Note: In an ideal world, we would not pass the data back to react native(no cookies? i think)
    // //* but set the cookie, by doing say. This is because you no longer need to pass in values
    // //* and the Access token is stored in a secure cookie, as a result of httpOnly:true.
    res.cookie('accessToken', accessToken, {
      maxAge: ACCESS_TOKEN_UPDATE_SECONDS, // 5 minutes
      httpOnly: true,
      secure: true,
    });
    res.cookie('refreshToken', refreshToken, {
      maxAge: REFRESH_TOKEN_UPDATE_SECONDS, // 5 minutes
      httpOnly: true,
      secure: true,
    });
    res.status(200).json({
      accessToken,
      refreshToken,
    });
  } catch (e) {
    console.log(e);
    next(e);
    return;
  }
};

/**
 * Get the servers public key
 * @route GET /verifyemail
 *
 */
export const verifyEmail = async (
  req: Request,
  res: Response,
): Promise<void> => {
  //TODO: Create better looking HTML for response websites
  try {
    const rootFilePath = path.dirname(require.main.filename);
    const token = req.params.token;
    const { payload, expired } = verifyJWT(token);
    if (expired) {
      res.sendFile(
        path.join(rootFilePath, 'public/views/auth/tokenExpired.html'),
      );
      return;
    }
    if (!payload) {
      res.sendFile(
        path.join(rootFilePath, 'public/views/auth/invalidToken.html'),
      );
      return;
    }
    const { id } = payload;

    await updateVerifiedEmail(id);

    res.sendFile(
      path.join(rootFilePath, 'public/views/auth/verifiedEmail.html'),
    );
    return;
  } catch (e) {
    const rootFilePath = path.dirname(require.main.filename);
    res.sendFile(
      path.join(rootFilePath, 'public/views/auth/internalError.html'),
    );
    return;
  }
};

export const forgotPasswordEmailGeneration = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const UserEmail = req.body.email;
    if (!UserEmail) {
      throw new AppError('email is a required field', 402);
    }
    //Note an error is thrown below if a user does not exist
    const userData = await getUserData(UserEmail, 'EMAIL');
    const randomGeneratedNumbers = generateForgotEmailRandomNumbers();
    await updateForgotEmailVerificationCodeDB(
      userData.id,
      randomGeneratedNumbers,
    );
    await sendForgottenEmail(UserEmail, randomGeneratedNumbers);
    res.status(200).json({
      status: 'success',
      message: 'Forgot password email sent',
    });
    return;
  } catch (e) {
    next(e);
    return;
  }
};

export const verifyForgottenPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { email, value1, value2, value3, value4, value5, value6 } =
      validateForgotPasswordValidator(req);

    const userData = await getUserData(email, 'EMAIL');
    if (!userData.reset_verification_code) {
      throw new AppError(
        'generate a password reset email. Before attempting reset.',
        403,
      );
    }
    const forgotPassDBExtracted = userData.reset_verification_code;
    const expired = parseInt(forgotPassDBExtracted.expiryTime) < Date.now();
    if (expired) {
      throw new AppError(
        'the password forgot values have expired. Generate a new verification email.',
        401,
      );
    }
    await decreaseCurrentAttempt(
      userData.id,
      forgotPassDBExtracted.valuesString,
      forgotPassDBExtracted.currentAttempt,
    );
    if (forgotPassDBExtracted.currentAttempt <= 0) {
      throw new AppError(
        'You have reached max attempts. Please generate a new forgot password email.',
        403,
      );
    }

    const valuesMatch = checkIfValidationCodesMatch(
      value1,
      value2,
      value3,
      value4,
      value5,
      value6,
      forgotPassDBExtracted,
    );
    if (!valuesMatch) {
      throw new AppError('Validation values are not correct', 401, {
        attemptsRemaining: forgotPassDBExtracted.currentAttempt,
      });
    }

    //If there is a password provided then allow the user to reset it using this route.
    const password = req.body.password;
    if (!password) {
      res.status(200).json({
        status: 'success',
        message:
          'Validation values match. User can use these values to change a users password.',
      });
    } else {
      const validatedPassword = validatePassword(password);
      if (!validatedPassword.valid) {
        throw new AppError(validatedPassword.error, 400);
      }
      await updateUserPassword(userData.id, password);
      await invalidateUserSession(userData.email);
      await sendPasswordChangedEmail(userData.email);
      res
        .status(200)
        .json({ status: 'success', message: 'password has been updated' });
    }
    return;
  } catch (e) {
    next(e);
    return;
  }
};

export const logoutUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    await invalidateUserSession(req.body.email);
    res.status(200).json({
      status: 'success',
      message: 'user has been logged out',
    });
    return;
  } catch (e) {
    next(e);
    return;
  }
};

export default {
  register,
  logoutUser,
  login,
  verifyEmail,
  forgotPasswordEmailGeneration,
  verifyForgottenPassword,
};
