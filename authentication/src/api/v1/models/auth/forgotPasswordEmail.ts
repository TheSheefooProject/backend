import SendGrid from '@sendgrid/mail';
import { FORGOT_EMAIL_EXPIRY_TIME } from '../../../../config/email';
import dbHelpers from '../../helpers/dbHelpers';
import AppError from '../../interfaces/AppError';
import User from '../../../../db/user';
const MAX_RETRY_PASSWORD_ATTEMPTS = 5;
interface RandomForgotNumbers {
  value1: number;
  value2: number;
  value3: number;
  value4: number;
  value5: number;
  value6: number;
  expiryTime: string;
  valuesString: string;
  currentAttempt: number;
  expired?: boolean;
}
export const generateForgotEmailRandomNumbers = (): RandomForgotNumbers => {
  const MAX_INTEGER = 9; // Means values from 0 to 9
  const value1 = Math.round(Math.random() * MAX_INTEGER);
  const value2 = Math.round(Math.random() * MAX_INTEGER);
  const value3 = Math.round(Math.random() * MAX_INTEGER);
  const value4 = Math.round(Math.random() * MAX_INTEGER);
  const value5 = Math.round(Math.random() * MAX_INTEGER);
  const value6 = Math.round(Math.random() * MAX_INTEGER);
  const expiryTime = Date.now() + FORGOT_EMAIL_EXPIRY_TIME * 60 * 1000; // Code expires in 5 mins
  const valuesString = `${expiryTime}:${value1},${value2},${value3},${value4},${value5},${value6}:${MAX_RETRY_PASSWORD_ATTEMPTS}`;
  return {
    value1,
    value2,
    value3,
    value4,
    value5,
    value6,
    currentAttempt: MAX_RETRY_PASSWORD_ATTEMPTS,
    expiryTime: expiryTime.toString(),
    valuesString,
  };
};

export const checkIfValidationCodesMatch = (
  value1: number,
  value2: number,
  value3: number,
  value4: number,
  value5: number,
  value6: number,
  valuesToCheckAgainst: RandomForgotNumbers,
): boolean => {
  let valid = true;
  if (valuesToCheckAgainst.value1 != value1) {
    valid = false;
  }
  if (valuesToCheckAgainst.value2 != value2) {
    valid = false;
  }
  if (valuesToCheckAgainst.value3 != value3) {
    valid = false;
  }
  if (valuesToCheckAgainst.value4 != value4) {
    valid = false;
  }
  if (valuesToCheckAgainst.value5 != value5) {
    valid = false;
  }
  if (valuesToCheckAgainst.value6 != value6) {
    valid = false;
  }
  return valid;
};

export const updateForgotEmailVerificationCodeDB = async (
  id: string,
  verificationCodes: RandomForgotNumbers,
): Promise<void> => {
  try {
    await User.findOneAndUpdate(
      { id },
      { reset_verification_code: verificationCodes },
    );
  } catch (e) {
    throw new AppError('Internal server generating verification value');
  }
};

export const decreaseCurrentAttempt = async (
  id: string,
  verificationCodes: string,
  currentAttempt: number,
): Promise<void> => {
  const verificationCodesArray = verificationCodes.split(':');
  const updatedVerificationString = `${verificationCodesArray[0]}:${
    verificationCodesArray[1]
  }:${currentAttempt - 1}`;
  await updateForgotEmailVerificationCodeDB(id, updatedVerificationString);
};

//* Below methods are for verification email generation
export const sendForgottenEmail = async (
  emailToSendTo: string,
  forgotNumber: RandomForgotNumbers,
): Promise<void> => {
  SendGrid.setApiKey(process.env.SEND_GRID_API);
  try {
    const msg = {
      to: emailToSendTo,
      from: 'no-reply@safeknight.app',
      subject: 'SafeKnight Email Verification',
      templateId: 'd-3d3350297efe4432ae58a84ed0b60652',
      dynamicTemplateData: {
        ...forgotNumber,
      },
    };
    await SendGrid.send(msg);
  } catch (e) {
    throw new AppError('Failed sending verification email');
  }
};

export const sendPasswordChangedEmail = async (
  emailToSendTo: string,
): Promise<void> => {
  SendGrid.setApiKey(process.env.SEND_GRID_API);
  try {
    const msg = {
      to: emailToSendTo,
      from: 'no-reply@safeknight.app',
      subject: 'SafeKnight Email Verification',
      templateId: 'd-f674cce260924147afb9326419a68ec1',
      dynamicTemplateData: {
        passwordUpdateTime: new Date(Date.now()).toString(),
      },
    };
    await SendGrid.send(msg);
  } catch (e) {
    throw new AppError('Failed sending verification email');
  }
};
export default {
  generateForgotEmailRandomNumbers,
  updateForgotEmailVerificationCodeDB,
  sendForgottenEmail,
  checkIfValidationCodesMatch,
  decreaseCurrentAttempt,
};
