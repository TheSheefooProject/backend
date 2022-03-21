import SendGrid from '@sendgrid/mail';
import AppError from '../../interfaces/AppError';
import {
  FORGOT_EMAIL_EXPIRY_TIME,
  VALID_EMAIL_ORG_PREFIX,
} from '../../../../config/email';
import { signJWT } from './jwt';
import dbHelpers from '../../helpers/dbHelpers';
import User from '../../../../db/user';

export const validOrganizationEmail = (email: string): boolean => {
  const emailSuffix = email && email.split('@')[1];
  return VALID_EMAIL_ORG_PREFIX.includes(emailSuffix);
};

//* Below methods are for verification email generation
export const sendVerificationEmail = async (
  emailToSendTo: string,
  currentHostname = 'http://localhost:3000',
  userID: string,
): Promise<void> => {
  SendGrid.setApiKey(process.env.SEND_GRID_API);
  try {
    const verificationToken = signJWT(
      { id: userID, email: emailToSendTo },
      `${FORGOT_EMAIL_EXPIRY_TIME}s`,
    );
    const msg = {
      to: emailToSendTo,
      from: 'sheefooapphelp@outlook.com',
      subject: 'Sheefoo Email Verification',
      templateId: 'd-4cdad35446c545388daeecd7c1dabd0b',
      dynamicTemplateData: {
        verifyEmailUrl: `http://www.${currentHostname}${currentHostname}/api/v1/auth/verifyemail/${verificationToken}`,
      },
    };
    await SendGrid.send(msg);
  } catch (e) {
    console.log(e);
    throw new AppError('Failed sending verification email');
  }
};

//* Below methods for updating DB of verified state
export const updateVerifiedEmail = async (id: string): Promise<void> => {
  try {
    await User.findOneAndUpdate({ id }, { verified_email: true });
  } catch (e) {
    throw new AppError('Failed verifying users email');
  }
};

export default {
  sendVerificationEmail,
  validOrganizationEmail,
  updateVerifiedEmail,
};
