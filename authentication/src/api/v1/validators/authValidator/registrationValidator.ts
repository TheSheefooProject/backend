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
    full_name: fullNameRaw,
    username: usernameRaw,
    email: emailRaw,
    password: passwordRaw,
  } = req.body;

  const emailObject = validateEmail(emailRaw);
  const fullNameObject = validateName(fullNameRaw);
  const usernameObject = validateUsername(usernameRaw);
  const passwordObject = validatePassword(passwordRaw);

  if (!emailObject.valid) {
    error.push(emailObject.error);
  }
  if (!fullNameObject.valid) {
    error.push(fullNameObject.error);
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
    full_name: fullNameObject,
    username: usernameRaw,
    email: emailRaw,
    password: passwordRaw,
  };
};

export default { validateRegistrationFields };
