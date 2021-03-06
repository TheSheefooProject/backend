import bcrypt from 'bcryptjs';
import dbHelpers from '../../helpers/dbHelpers';
import AppError from '../../interfaces/AppError';
import { Gender } from '../../interfaces/user';
import { getUserData } from '../user';
import User from '../../../../db/user';
import userModel from '../../../../db/user';
import mongoose from 'mongoose';
const PASSWORD_SALT_SIZE = 10;

export const generateSaltedAndHashedPassword = async (
  password: string,
): Promise<string> => {
  const salt = await bcrypt.genSalt(PASSWORD_SALT_SIZE);
  const passwordHashedAndSalted = await bcrypt.hash(password, salt);
  return passwordHashedAndSalted;
};

export const createUser = async (
  full_name: string,
  username: string,
  email: string,
  passwordHash: string,
): Promise<boolean> => {
  const passwordHashedAndSalted = await generateSaltedAndHashedPassword(
    passwordHash,
  );
  const newUserClass = new userModel({
    username: username,
    password: passwordHashedAndSalted,
    email: email,
    verified_email: false,
    full_name,
  });
  try {
    await newUserClass.save();
  } catch (e) {
    return false;
  }
  return true;
};

export const createUserSession = async (email: string): Promise<number> => {
  //*Note the way this is currently implemented, we can only have one user logged in to an account at a given time!
  //*Since we are storing the user session id in the users data field. This is a cost saving measure.
  //*We should ideally have a new database table that just stores session data, so that we can invalidate
  //*particular session variables at a given time. I personally do not think this is a huge issue rn.
  const userData = await getUserData(email);
  const newSessionID = userData.session_id + 1;
  // 1 represents valid, since schema has boolean for that field
  try {
    await User.findOneAndUpdate(
      { _id: userData.id },
      { session_id: newSessionID, session_valid: true },
    );
  } catch (e) {
    throw new AppError('Failed authorizing user.');
  }
  return newSessionID;
};

//todo: Below should be called when a user calls all the forgot user stuff.
export const invalidateUserSession = async (email: string): Promise<void> => {
  const userData = await getUserData(email);
  try {
    await User.findOneAndUpdate({ _id: userData.id }, { session_valid: false });
  } catch (e) {
    throw new AppError('Failed un-authorizing user.');
  }
};

export const getUserSessionData = async (userID: string) => {
  try {
    const userData = await getUserData(userID, 'ID');
    return userData && userData.session_valid ? userData : null;
  } catch (e) {
    return false;
  }
};

//* Update user password
export const updateUserPassword = async (
  userID: string,
  password: string,
  hashed = false,
): Promise<void> => {
  let hashedPassword = password;
  if (!hashed) {
    hashedPassword = await generateSaltedAndHashedPassword(password);
  }
  const UPDATE_QUERY = `UPDATE users SET password='${hashedPassword}' where id='${userID}'`;
  const updateQuery = await dbHelpers.updateQuery(UPDATE_QUERY);
  if (updateQuery.status == dbHelpers.APIStatus.Failed) {
    throw new AppError('Internal server changing user password');
  }
};
export default {
  generateSaltedAndHashedPassword,
  getUserSessionData,
  createUser,
  createUserSession,
  invalidateUserSession,
};
