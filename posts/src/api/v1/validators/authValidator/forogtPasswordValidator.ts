import { Request } from 'express';
import AppError from '../../interfaces/AppError';
import { validateEmail } from '../userValidator/general';
interface validationStatus {
  valid: boolean;
  error: string;
  value?: any;
}
export const validateForgotValue = (
  value: string | number,
  index = '',
): validationStatus => {
  if (!value) {
    return {
      valid: false,
      error: `value ${index} is a required field`,
      value,
    };
  }
  if (typeof value === 'number') {
    value = value.toString();
  }
  if (value.length > 1) {
    return {
      valid: false,
      error: `value ${index} must be of size 1`,
      value,
    };
  }
  return {
    valid: true,
    error: '',
    value,
  };
};

export const validateForgotPasswordValidator = (req: Request) => {
  const errors = [];
  const { value1, value2, value3, value4, value5, value6, email } = req.body;

  const emailObj = validateEmail(email);
  const value1Obj = validateForgotValue(value1, '1');
  const value2Obj = validateForgotValue(value2, '2');
  const value3Obj = validateForgotValue(value3, '3');
  const value4Obj = validateForgotValue(value4, '4');
  const value5Obj = validateForgotValue(value5, '5');
  const value6Obj = validateForgotValue(value6, '6');

  if (!emailObj.valid) {
    errors.push(emailObj.error);
  }
  if (!value1Obj.valid) {
    errors.push(value1Obj.error);
  }
  if (!value2Obj.valid) {
    errors.push(value2Obj.error);
  }
  if (!value3Obj.valid) {
    errors.push(value3Obj.error);
  }
  if (!value4Obj.valid) {
    errors.push(value4Obj.error);
  }
  if (!value5Obj.valid) {
    errors.push(value5Obj.error);
  }
  if (!value6Obj.valid) {
    errors.push(value6Obj.error);
  }

  if (errors.length > 0) {
    throw new AppError(
      `Forgot password fields were not correct. There were ${errors.length} errors`,
      401,
      { validationErrors: errors },
    );
  }

  return {
    email: emailObj.value,
    value1: value1Obj.value,
    value2: value2Obj.value,
    value3: value3Obj.value,
    value4: value4Obj.value,
    value5: value5Obj.value,
    value6: value6Obj.value,
  };
};

export default { validateForgotPasswordValidator };
