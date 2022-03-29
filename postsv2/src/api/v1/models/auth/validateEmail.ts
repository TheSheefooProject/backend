import SendGrid from '@sendgrid/mail';
import AppError from '../../interfaces/AppError';
import {
  FORGOT_EMAIL_EXPIRY_TIME,
  VALID_EMAIL_ORG_PREFIX,
} from '../../../../config/email';
import { signJWT } from './jwt';
import dbHelpers from '../../helpers/dbHelpers';

export const validOrganizationEmail = (email: string): boolean => {
  const emailSuffix = email && email.split('@')[1];
  return VALID_EMAIL_ORG_PREFIX.includes(emailSuffix);
};

//* Below methods are for verification email generation
type EmailType = 'ORGANIZATIONAL' | 'PERSONAL' | 'BOTH';
export const sendVerificationEmail = async (
  emailToSendTo: string,
  currentHostname = 'https://www.safeknight.app',
  userID: string,
  type: EmailType = 'ORGANIZATIONAL',
): Promise<void> => {
  SendGrid.setApiKey(process.env.SEND_GRID_API);
  try {
    const verificationToken = signJWT(
      { id: userID, type, email: emailToSendTo },
      `${FORGOT_EMAIL_EXPIRY_TIME}s`,
    );
    const msg = {
      to: emailToSendTo,
      from: 'no-reply@safeknight.app',
      subject: 'SafeKnight Email Verification',
      templateId: 'd-029a2970c2894ee0987bd20d8d5941d4',
      dynamicTemplateData: {
        verifyEmailUrl: `https://www.${currentHostname}/api/v1/auth/verifyemail/${verificationToken}`,
      },
    };
    await SendGrid.send(msg);
  } catch (e) {
    throw new AppError('Failed sending verification email');
  }
};

//* Below methods for updating DB of verified state
export const updateVerifiedEmail = async (
  id: string,
  email: string,
  type: EmailType,
): Promise<void> => {
  let UPDATE_QUERY;
  switch (type) {
    case 'BOTH':
      UPDATE_QUERY = `UPDATE users SET email_verification=${1}, organizational_email_verification=${1}, organizational_email='${email}' WHERE id='${id}'`;
      break;
    case 'PERSONAL':
      UPDATE_QUERY = `UPDATE users SET email_verification=${1} WHERE id='${id}'`;
      break;
    case 'ORGANIZATIONAL':
      UPDATE_QUERY = `UPDATE users SET organizational_email_verification=${1} WHERE id='${id}'`;
      break;
    default:
      UPDATE_QUERY = `UPDATE users SET organizational_email_verification=${1} where id='${id}'`;
      break;
  }
  const updateQuery = await dbHelpers.updateQuery(UPDATE_QUERY);
  if (updateQuery.status == dbHelpers.APIStatus.Failed) {
    throw new AppError('Internal server error verifying email');
  }
};

export default {
  sendVerificationEmail,
  validOrganizationEmail,
  updateVerifiedEmail,
};
