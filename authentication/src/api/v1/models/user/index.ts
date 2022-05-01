import dbHelpers from '../../helpers/dbHelpers';
import AppError from '../../interfaces/AppError';
import { validOrganizationEmail } from '../auth/validateEmail';
import userModel from '../../../../db/user';
import User from '../../../../db/user';
//* Generic function for get all data associated to a user
type GET_QUERY_PARAMETER_TYPE = 'USERNAME' | 'EMAIL' | 'ID';
export const getUserData = async (
  identifier: string,
  type: GET_QUERY_PARAMETER_TYPE = 'EMAIL',
  returnStrippedData = false,
): Promise<any> => {
  try {
    let userData;
    if (type === 'EMAIL') {
      userData = await userModel.findOne({ email: identifier }).exec();
    } else if (type === 'USERNAME') {
      userData = await userModel.findOne({ username: identifier }).exec();
    } else {
      userData = await userModel.findOne({ id: identifier }).exec();
    }
    return userData;
  } catch (e) {
    throw new AppError('Failed finding user details', 400);
  }
};

//* Generic function for getting user ID
export const getUserId = async (
  identifier: string,
  type: GET_QUERY_PARAMETER_TYPE = 'USERNAME',
): Promise<string | null> => {
  if (type == 'ID') {
    return identifier;
  }
  const userData = await getUserData(identifier, type);
  return userData === null ? null : userData.id;
};

export const deleteUserFromUserTable = async (
  userID: string,
): Promise<void> => {
  try {
    await User.findOneAndDelete({ id: userID });
  } catch (e) {
    throw new AppError('Failed to delete user data.');
  }
};
export const updateUserDetailsInDB = async (
  id: string,
  newEmail?: string,
  newPassword?: string,
  newUsername?: string,
  newFullName?: string,
  newProfilePicURL?: string,
): Promise<void> => {
  const updateObject: any = {};
  if (newEmail) {
    updateObject['email'] = newEmail;
  }
  if (newUsername) {
    updateObject['username'] = newUsername;
  }
  if (newPassword) {
    updateObject['password'] = newPassword;
  }
  if (newFullName) {
    updateObject['full_name'] = newFullName;
  }
  if (newProfilePicURL) {
    updateObject['profile_pic_url'] = newProfilePicURL;
  }
  try {
    await User.findOneAndUpdate({ id }, updateObject);
  } catch (e) {
    throw new AppError('Internal server changing user data.');
  }
};

export default {
  getUserId,
  getUserData,
  updateUserDetailsInDB,
  deleteUserFromUserTable,
};
