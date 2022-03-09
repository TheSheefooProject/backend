// Name validators
const NAME_MAX_LENGTH = 30;
const NAME_MIN_LENGTH = 1;
// Username validators
const USERNAME_MAX_LENGTH = 20;
const USERNAME_MIN_LENGTH = 2;
// Phone validators
const PHONE_MAX_LENGTH = 16;
const PHONE_MIN_LENGTH = 10;

interface validationStatus {
  valid: boolean;
  error: string;
  value?: any;
}
export const validateEmail = (
  email: string,
  required = true,
): validationStatus => {
  if (required && !email) {
    return {
      valid: false,
      error: 'email is a required field',
      value: email,
    };
  }
  if (email.length > 255) {
    return {
      valid: false,
      error: 'email must be smaller than 255 characters',
      value: email,
    };
  }
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const valid = re.test(String(email || '').toLowerCase());
  return {
    valid,
    error: !valid ? 'Email is not valid' : 'Email is not provided',
    value: email,
  };
};

type nameValidationType = 'FIRST' | 'LAST';
export const validateName = (
  name: string,
  type: nameValidationType = 'FIRST',
  required = true,
): validationStatus => {
  if (required && !name) {
    return {
      valid: false,
      error: `${type.toLowerCase()}Name is a required field`,
      value: name,
    };
  }
  let error: string;
  //Ensure alphanumeric
  const letterNumber = /^[0-9a-zA-Z]+$/;
  const validName = name.match(letterNumber);
  if (!validName) {
    error = `${type.toLowerCase()} name must only be alphanumeric`;
  }
  if (name.length > NAME_MAX_LENGTH) {
    error = `${type.toLowerCase()} name must be smaller than ${NAME_MAX_LENGTH}`;
  }
  if (name.length < NAME_MIN_LENGTH) {
    error = `${type.toLowerCase()} name must be larger than ${NAME_MIN_LENGTH}`;
  }
  return { valid: !Boolean(error), error, value: name };
};

export const validateUsername = (
  username: string,
  required = true,
): validationStatus => {
  if (required && !username) {
    return {
      valid: false,
      error: 'username is a required field',
      value: username,
    };
  }
  let error: string;
  const letterNumber = /^[0-9a-zA-Z]+$/;
  const validUsername = username.match(letterNumber);
  if (!validUsername) {
    error = 'username must only be alphanumeric';
  }

  if (username && username.length > USERNAME_MAX_LENGTH) {
    error = `username must be smaller than ${USERNAME_MAX_LENGTH}`;
  }
  if (username && username.length < USERNAME_MIN_LENGTH) {
    error = `username must be larger than ${USERNAME_MIN_LENGTH}`;
  }
  return { valid: !Boolean(error), error, value: username };
};

export const validatePassword = (
  password: string,
  required = true,
): validationStatus => {
  if (required && !password) {
    return {
      valid: false,
      error: 'password is a required field',
      value: password,
    };
  }
  return { valid: true, error: '', value: password };
};

export const validateProfilePic = (
  profilePicSeed: string,
  required = true,
): validationStatus => {
  if (required && !profilePicSeed) {
    return {
      valid: false,
      error: 'profilePicSeed is a required field',
      value: profilePicSeed,
    };
  }
  if (profilePicSeed && profilePicSeed.length > 255) {
    return {
      valid: false,
      error: 'profilePicSeed must be smaller than 255 characters',
      value: profilePicSeed,
    };
  }
  return { valid: true, error: '', value: profilePicSeed };
};

export const validatePhoneNumber = (
  phoneNumber: string,
  required = true,
): validationStatus => {
  let error: string;
  if (required && !phoneNumber) {
    return {
      valid: false,
      error: 'number is a required field',
      value: phoneNumber,
    };
  }
  if (phoneNumber && phoneNumber.includes(' ')) {
    return {
      valid: false,
      error: 'number must not contain a space',
      value: phoneNumber,
    };
  }
  if (phoneNumber && phoneNumber.length > PHONE_MAX_LENGTH) {
    error = `number must be smaller than ${PHONE_MAX_LENGTH}`;
  }
  if (phoneNumber && phoneNumber.length < PHONE_MIN_LENGTH) {
    error = `number must be larger than ${PHONE_MIN_LENGTH}`;
  }
  return { valid: !Boolean(error), error, value: phoneNumber };
};

export const validateGender = (
  gender: string,
  required = true,
): validationStatus => {
  if (required && !gender) {
    return {
      valid: false,
      error: 'gender is a required field',
      value: gender,
    };
  }
  if (
    gender &&
    (gender.toUpperCase() === 'MALE' ||
      gender.toUpperCase() === 'FEMALE' ||
      gender.toUpperCase() === 'OTHER')
  ) {
    return {
      valid: true,
      error: '',
      value: gender.toUpperCase(),
    };
  } else {
    return {
      valid: true,
      error: 'Setting gender to other',
      value: 'OTHER',
    };
  }
};

export const validateDOB = (dob: string, required = true): validationStatus => {
  if (required && !Boolean(dob)) {
    return {
      valid: false,
      error: 'date is a required field',
      value: '',
    };
  }
  const valid = !Boolean(isNaN(new Date(dob).getTime()));

  return {
    valid,
    error: valid ? '' : 'date is invalid format',
    value: dob,
  };
};

export default {
  validateProfilePic,
  validateEmail,
  validateName,
  validateUsername,
  validateGender,
  validateDOB,
  validatePhoneNumber,
  validatePassword,
};
