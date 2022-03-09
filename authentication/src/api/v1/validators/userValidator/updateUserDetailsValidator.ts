import { Request } from 'express';
import AppError from '../../interfaces/AppError';
import {
  validateDOB,
  validateEmail,
  validateGender,
  validateName,
  validatePassword,
  validatePhoneNumber,
  validateProfilePic,
  validateUsername,
} from './general';

interface validationStatus {
  valid: boolean;
  error: string;
  value?: any;
}
export const updateUserDetailsValidator = (req: Request) => {
  const error = [];
  const {
    firstName: firstNameRaw,
    lastName: lastNameRaw,
    number: numberRaw,
    gender: genderRaw,
    username: usernameRaw,
    email: emailRaw,
    password: passwordRaw,
    dob: dobRaw,
    profilePicSeed,
    publicProfile,
  } = req.body;

  const emailObject = emailRaw && validateEmail(emailRaw);
  const firstNameObject = firstNameRaw && validateName(firstNameRaw);
  const lastNameObject = lastNameRaw && validateName(lastNameRaw, 'LAST');
  const numberObject = numberRaw && validatePhoneNumber(numberRaw);
  const usernameObject = usernameRaw && validateUsername(usernameRaw);
  const dobObject = dobRaw && validateDOB(dobRaw);
  const genderObject = genderRaw && validateGender(genderRaw, false);
  const passwordObject = passwordRaw && validatePassword(passwordRaw);
  const profilePicSeedObject =
    profilePicSeed && validateProfilePic(profilePicSeed);
  const publicProfileToggle = publicProfile && Boolean(publicProfile);

  if (emailObject && !emailObject.valid) {
    error.push(emailObject.error);
  }
  if (firstNameObject && !firstNameObject.valid) {
    error.push(firstNameObject.error);
  }
  if (lastNameObject && !lastNameObject.valid) {
    error.push(lastNameObject.error);
  }
  if (usernameObject && !usernameObject.valid) {
    error.push(usernameObject.error);
  }
  if (passwordObject && !passwordObject.valid) {
    error.push(passwordObject.error);
  }
  if (numberObject && !numberObject.valid) {
    error.push(numberObject.error);
  }
  if (dobObject && !dobObject.valid) {
    error.push(dobObject.error);
  }
  if (profilePicSeedObject && !profilePicSeedObject.valid) {
    error.push(profilePicSeedObject.error);
  }

  if (error.length > 0) {
    throw new AppError(
      `Update fields were not correct. There were ${error.length} errors`,
      401,
      { validationErrors: error },
    );
  }

  const DataToReturn = {
    firstName: firstNameObject && firstNameObject.value,
    lastName: lastNameObject && lastNameObject.value,
    number: numberObject && numberObject.value,
    gender: genderObject && genderObject.value,
    username: usernameObject && usernameObject.value,
    email: emailObject && emailObject.value,
    password: passwordObject && passwordObject.value,
    dob: dobObject && dobObject.value,
    profilePicSeed: profilePicSeedObject && profilePicSeedObject.value,
    publicProfile: publicProfileToggle,
  };
  const areAllFieldsBlank = Object.values(DataToReturn).every(
    o => o === undefined,
  );
  if (areAllFieldsBlank) {
    throw new AppError('at least one field must be updated', 401);
  }

  return DataToReturn;
};

export default { updateUserDetailsValidator };
