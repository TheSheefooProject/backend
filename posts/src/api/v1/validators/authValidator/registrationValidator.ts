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
    username: usernameRaw,
    email: emailRaw,
    password: passwordRaw,
  } = req.body;

  const emailObject = validateEmail(emailRaw);
  const firstNameObject = validateName(firstNameRaw);
  const lastNameObject = validateName(lastNameRaw, 'LAST');
  const usernameObject = validateUsername(usernameRaw);
  const passwordObject = validatePassword(passwordRaw);

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
    username: usernameRaw,
    email: emailRaw,
    password: passwordRaw,
  };
};

export default { validateRegistrationFields };
