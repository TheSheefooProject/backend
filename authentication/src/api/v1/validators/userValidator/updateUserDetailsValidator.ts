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
    full_name: fullNamRaw,
    username: usernameRaw,
    email: emailRaw,
    password: passwordRaw,
    profilePicURL,
    user_bio: userBioRaw,
  } = req.body;

  const emailObject = emailRaw && validateEmail(emailRaw);
  const firstNameObject = fullNamRaw && validateName(fullNamRaw);
  const usernameObject = usernameRaw && validateUsername(usernameRaw);
  const passwordObject = passwordRaw && validatePassword(passwordRaw);

  if (emailObject && !emailObject.valid) {
    error.push(emailObject.error);
  }
  if (firstNameObject && !firstNameObject.valid) {
    error.push(firstNameObject.error);
  }
  if (usernameObject && !usernameObject.valid) {
    error.push(usernameObject.error);
  }
  if (passwordObject && !passwordObject.valid) {
    error.push(passwordObject.error);
  }
  //Hackily done to have it done quickly
  if (userBioRaw && userBioRaw.length > 200) {
    error.push('Bio cannot be more than 200 characters');
  }

  if (error.length > 0) {
    throw new AppError(
      `Update fields were not correct. There were ${error.length} errors`,
      401,
      { validationErrors: error },
    );
  }

  const DataToReturn = {
    full_name: fullNamRaw && firstNameObject.value,
    username: usernameObject && usernameObject.value,
    email: emailObject && emailObject.value,
    password: passwordObject && passwordObject.value,
    profilePicURL,
    user_bio: userBioRaw,
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
