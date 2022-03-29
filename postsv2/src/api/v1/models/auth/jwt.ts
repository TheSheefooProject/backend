import jwt from 'jsonwebtoken';
import {
  privateKeyForTesting,
  publicKeyForTesting,
} from '../../../../config/jwt';

// sign jwt
export function signJWT(payload: any, expiresIn: string | number): string {
  //TODO Note in production, we need to check below works, and environment variable is passed in.

  const privateKey = process.env.JWT_PRIVATE_KEY || privateKeyForTesting;
  const signedJWT = jwt.sign(payload, privateKey, {
    algorithm: 'RS256',
    expiresIn,
  });
  return signedJWT;
}

export function verifyJWT(token: string): any {
  try {
    //TODO Note in production, we need to check below works, and environment variable is passed in.
    const publicKey = process.env.JWT_PUBLIC_KEY || publicKeyForTesting;
    const decoded = jwt.verify(token, publicKey);
    return { payload: decoded, expired: false };
  } catch (error) {
    return {
      payload: null,
      expired: error.message.includes('jwt expired'),
    };
  }
}
