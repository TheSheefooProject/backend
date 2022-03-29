import { NextFunction, Request, Response } from 'express';
import {
  ACCESS_TOKEN_UPDATE_SECONDS,
  ACCESS_TOKEN_UPDATE_TIME,
} from '../../../config/jwt';
import { signJWT, verifyJWT } from '../models/auth/jwt';
import { getUserSessionData } from '../models/auth/user';

export const verifyUserAuthentication = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const accessToken = _extractAccessToken(req);
    const refreshToken = _extractRefreshToken(req);
    if (!accessToken) {
      res.status(401).json({
        status: 'error',
        message: 'An access token has to be provided.',
      });
      return;
    }

    const { payload, expired } = verifyJWT(accessToken);
    if (payload) {
      res.status(200).json({
        status: 'success',
        payload,
      });
      return;
    }
    //expired but valid access token
    const { payload: refresh } =
      expired && refreshToken ? verifyJWT(refreshToken) : { payload: null };

    if (!refresh) {
      res.status(401).json({
        status: 'error',
        message: 'The access token has expired. A provide a refresh token.',
      });
      return;
    }

    const userData = await getUserSessionData(refresh.id);

    if (!userData) {
      res.status(500).json({
        status: 'error',
        message:
          'User data could not be found from refresh token. Check account is not deleted or refresh token expired.',
      });
      return;
    }

    const newAccessToken = signJWT(
      {
        id: userData.id,
        email: userData.email,
        username: userData.username,
        sessionId: userData.session_id,
      },
      ACCESS_TOKEN_UPDATE_TIME,
    );

    res.cookie('accessToken', accessToken, {
      maxAge: ACCESS_TOKEN_UPDATE_SECONDS,
      httpOnly: true,
      secure: true,
    });
    // res.set('access_token', newAccessToken);

    const userPayloadData = verifyJWT(newAccessToken).payload;
    res.status(200).json({
      status: 'success',
      payload: userPayloadData,
    });
    return;
  } catch (e) {
    next(e);
    return;
  }
};

function _extractAccessToken(req: Request): string {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(' ')[0] === 'Bearer'
  ) {
    return req.headers.authorization.split(' ')[1];
  }
  return '';
}

function _extractRefreshToken(req: Request): string {
  if (req.headers.refresh_token) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return req.headers.refresh_token;
  }
  return '';
}

export default {
  verifyUserAuthentication,
};
