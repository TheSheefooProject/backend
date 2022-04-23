import { NextFunction, Request, Response } from 'express';
import AppError from '../interfaces/AppError';
import { generateSaltedAndHashedPassword } from '../models/auth/user';
import {
  sendVerificationEmail,
  validOrganizationEmail,
} from '../models/auth/validateEmail';
import {
  deleteUserFromUserTable,
  getUserData,
  getUserId,
  updateUserDetailsInDB,
} from '../models/user';
import { updateUserDetailsValidator } from '../validators/userValidator/updateUserDetailsValidator';

/**
 * Get the user
 * @route GET /user
 */
export const checkUsernameExists = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { username } = req.params;
    // validateUsername(username);
    const isUsernameNotUnique = await getUserId(username, 'USERNAME');
    if (isUsernameNotUnique) {
      throw new AppError('Username is taken by another account', 403);
    }
    res
      .status(200)
      .json({ status: 'success', message: 'Username is not taken' });
  } catch (e) {
    next(e);
    return;
  }
};

/**
 * Get the user
 * @route GET /user
 */
export const getUserDetails = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    res.status(200).json({ status: 'success', message: req.user });
    // const userData = await getUserData(req.user.id, 'ID', true);
    // res.status(200).json({ status: 'success', userData });
    return;
  } catch (e) {
    next(e);
    return;
  }
};

/**
 * Get the user
 * @route DELETE /user
 */
export const updateUserDetails = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const {
      firstName,
      lastName,
      number,
      gender,
      username,
      email,
      password,
      dob,
      profilePicSeed,
      publicProfile,
    } = updateUserDetailsValidator(req);

    if (username) {
      const isUsernameNotUnique = await getUserId(username, 'USERNAME');
      if (isUsernameNotUnique) {
        throw new AppError('Username is taken by another account', 403);
      }
    }
    if (email) {
      const isEmailNotUnique = await getUserId(email, 'EMAIL');
      if (isEmailNotUnique) {
        throw new AppError(
          'Email is already registered to another account',
          403,
        );
      }
      await sendVerificationEmail(
        email,
        req.headers.host,
        req.user.id,
        validOrganizationEmail(email) ? 'BOTH' : 'PERSONAL',
      );
    }
    let hashedPassword;
    if (password) {
      hashedPassword = await generateSaltedAndHashedPassword(password);
      // await updateUserDetailsInDB(req.user.id, undefined, hashedPassword);
    }

    const invalidatePreviousOrgEmail = validOrganizationEmail(email);
    // The above is since if the user email is an org email you want to change orgs. To main email.
    await updateUserDetailsInDB(
      req.user.id,
      email,
      hashedPassword,
      username,
      firstName,
      lastName,
      number,
      gender,
      dob,
      profilePicSeed,
      publicProfile,
      invalidatePreviousOrgEmail,
    );
    res.status(200).json({
      status: 'success',
      message: 'Elements have been updated',
    });
    return;
  } catch (e) {
    next(e);
    return;
  }
};

/**
 * Get the user
 * @route DELETE /user
 */
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    await deleteUserFromUserTable(req.user.id);
    //TODO Add remaining user delete actions
    res.status(200).json({
      status: 'success',
      message: 'user has been deleted',
    });
    return;
  } catch (e) {
    next(e);
    return;
  }
};
export default {
  getUserDetails,
  checkUsernameExists,
  deleteUser,
  updateUserDetails,
};