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
    username: usernameRaw,
    email: emailRaw,
    password: passwordRaw,
    profilePicURL,
  } = req.body;

  const emailObject = emailRaw && validateEmail(emailRaw);
  const firstNameObject = firstNameRaw && validateName(firstNameRaw);
  const lastNameObject = lastNameRaw && validateName(lastNameRaw, 'LAST');
  const usernameObject = usernameRaw && validateUsername(usernameRaw);
  const passwordObject = passwordRaw && validatePassword(passwordRaw);

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
    username: usernameObject && usernameObject.value,
    email: emailObject && emailObject.value,
    password: passwordObject && passwordObject.value,
    profilePicURL,
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
