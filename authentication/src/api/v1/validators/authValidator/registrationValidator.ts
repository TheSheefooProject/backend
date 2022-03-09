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
} from '../userValidator/general';

export const validateRegistrationFields = (req: Request) => {
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
  } = req.body;

  const emailObject = validateEmail(emailRaw);
  const firstNameObject = validateName(firstNameRaw);
  const lastNameObject = validateName(lastNameRaw, 'LAST');
  const numberObject = validatePhoneNumber(numberRaw);
  const usernameObject = validateUsername(usernameRaw);
  const dobObject = validateDOB(dobRaw);
  const genderObject = validateGender(genderRaw);
  const passwordObject = validatePassword(passwordRaw);
  const profilePicSeedObject = validateProfilePic(profilePicSeed);

  if (!emailObject.valid) {
    error.push(emailObject.error);
  }
  if (!firstNameObject.valid) {
    error.push(firstNameObject.error);
  }
  if (!lastNameObject.valid) {
    error.push(lastNameObject.error);
  }
  if (!usernameObject.valid) {
    error.push(usernameObject.error);
  }
  if (!passwordObject.valid) {
    error.push(passwordObject.error);
  }
  if (!numberObject.valid) {
    error.push(numberObject.error);
  }
  if (!dobObject.valid) {
    error.push(dobObject.error);
  }
  if (!profilePicSeedObject.valid) {
    error.push(profilePicSeedObject.error);
  }

  if (error.length > 0) {
    throw new AppError(
      `Registration fields were not correct. There were ${error.length} errors`,
      401,
      { validationErrors: error },
    );
  }
  return {
    firstName: firstNameRaw,
    lastName: lastNameRaw,
    number: numberRaw,
    gender: genderObject.value,
    username: usernameRaw,
    email: emailRaw,
    password: passwordRaw,
    dob: dobRaw,
    profilePicSeed,
  };
};

export default { validateRegistrationFields };
