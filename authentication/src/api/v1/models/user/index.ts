import dbHelpers from '../../helpers/dbHelpers';
import AppError from '../../interfaces/AppError';
import { validOrganizationEmail } from '../auth/validateEmail';
import userModel from '../../../../db/user';
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

//* Add an org email to a given user
export const addOrgEmail = async (
  userID: string,
  email: string,
): Promise<void> => {
  const validOrgEmail = validOrganizationEmail(email);
  if (!validOrgEmail) {
    throw new AppError('Provided email is not a supported org', 402);
  }
  const UPDATE_QUERY = `UPDATE users SET organizational_email='${email}' where id='${userID}'`;
  const updateQuery = await dbHelpers.updateQuery(UPDATE_QUERY);
  if (updateQuery.status == dbHelpers.APIStatus.Failed) {
    throw new AppError('Internal server error verifying email');
  }
};

export const deleteUserFromUserTable = async (
  userID: string,
): Promise<void> => {
  const deleteQueryStatus = await dbHelpers.updateQuery(
    `DELETE FROM users WHERE id='${userID}'`,
  );
  if (deleteQueryStatus.status === dbHelpers.APIStatus.Failed) {
    throw new AppError('failed to delete user data');
  }
};
export const updateUserDetailsInDB = async (
  id: string,
  newEmail?: string,
  newPassword?: string,
  newUsername?: string,
  newFirstName?: string,
  newLastName?: string,
  newNumber?: string,
  newGender?: string,
  newDOB?: string,
  newProfilePicSeed?: string,
  newPublicProfile?: boolean,
  invalidateOrgEmail = false,
  newOrgEmail?: string,
): Promise<void> => {
  let baseQuery = 'UPDATE users SET ';
  if (newFirstName) {
    baseQuery = baseQuery + `forename='${newFirstName}', `;
  }
  if (newLastName) {
    baseQuery = baseQuery + `surname='${newLastName}', `;
  }
  if (newNumber) {
    baseQuery = baseQuery + `number='${newNumber}', `;
  }
  if (newGender) {
    baseQuery = baseQuery + `gender='${newGender}', `;
  }
  if (newUsername) {
    baseQuery = baseQuery + `username='${newUsername}', `;
  }
  if (newPassword) {
    baseQuery = baseQuery + `password='${newPassword}', `;
  }
  if (newEmail) {
    baseQuery = baseQuery + `email='${newEmail}', `;
  }
  if (newOrgEmail) {
    baseQuery = baseQuery + `organizational_email='${newOrgEmail}', `;
  }
  if (invalidateOrgEmail) {
    baseQuery =
      baseQuery +
      `organizational_email_verification='${invalidateOrgEmail ? 0 : 1}', `;
  }
  if (newDOB) {
    baseQuery = baseQuery + `dob='${newDOB}', `;
  }
  if (newProfilePicSeed) {
    baseQuery = baseQuery + `profile_pic_seed='${newProfilePicSeed}', `;
  }
  if (newPublicProfile) {
    baseQuery = baseQuery + `public_profile='${newPublicProfile ? 0 : 1}', `;
  }
  const FINAL_QUERY = `${baseQuery.substring(
    0,
    baseQuery.length - 2,
  )} WHERE id='${id}'`;
  const updateQuery = await dbHelpers.updateQuery(FINAL_QUERY);
  if (updateQuery.status == dbHelpers.APIStatus.Failed) {
    throw new AppError('Internal server changing user data');
  }
};

export default {
  getUserId,
  getUserData,
  addOrgEmail,
  updateUserDetailsInDB,
  deleteUserFromUserTable,
};
