import dbHelpers from '../../helpers/dbHelpers';
import AppError from '../../interfaces/AppError';
import { validOrganizationEmail } from '../auth/validateEmail';

//* Generic function for get all data associated to a user
type GET_QUERY_PARAMETER_TYPE = 'USERNAME' | 'EMAIL' | 'ID';
export const getUserData = async (
  identifier: string,
  type: GET_QUERY_PARAMETER_TYPE = 'EMAIL',
  field = '*',
  returnStrippedData = false,
): Promise<any> => {
  let QUERY;
  switch (type) {
    case 'USERNAME':
      QUERY = `SELECT ${field} FROM users WHERE username='${identifier}'`;
      break;
    case 'ID':
      QUERY = `SELECT ${field} FROM users WHERE id='${identifier}'`;
      break;
    default:
      QUERY = `SELECT ${field} FROM users WHERE email='${identifier}'`;
  }
  const userResult = await dbHelpers.getQuery(QUERY);
  if (userResult.status == dbHelpers.APIStatus.Failed) {
    throw new AppError('Failed finding user details', 400);
  }
  //Below parameter is if you want to be lazy and just return the NON-Sensitive user back to the frontend.
  if (returnStrippedData) {
    const userData = userResult.data[0];
    const userDataToReturn = {
      firstName: userData.forename,
      lastName: userData.surname,
      username: userData.username,
      email: userData.email,
      emailVerified: Boolean(userData.email_verification),
      organizationEmail: userData.organizational_email,
      organizationalEmailVerified: Boolean(
        userData.organizational_email_verification,
      ),
      dob: userData.email,
      gender: userData.gender,
      profilePic: userData.profile_pic_seed,
      publicProfile: userData.public_profile,
      number: userData.number,
      recentLng: userData.recent_lng,
      recentLat: userData.recent_lat,
    };
    return userDataToReturn;
  }
  return userResult.data[0];
};

//* Generic function for getting user ID
export const getUserId = async (
  identifier: string,
  type: GET_QUERY_PARAMETER_TYPE = 'USERNAME',
): Promise<any> => {
  const QUERY =
    type === 'USERNAME'
      ? `SELECT id FROM users WHERE username='${identifier}'`
      : `SELECT id FROM users WHERE email='${identifier}'`;
  const userResult = await dbHelpers.getQuery(QUERY);
  //Depending on parameter type return either the ID or null
  return userResult.empty ? null : userResult.data[0].id;
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
