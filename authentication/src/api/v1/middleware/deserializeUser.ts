import { NextFunction, Request, Response } from 'express';
import {
  ACCESS_TOKEN_UPDATE_SECONDS,
  ACCESS_TOKEN_UPDATE_TIME,
} from '../../../config/jwt';
// import { getSession } from '../db';
import { signJWT, verifyJWT } from '../models/auth/jwt';
import { getUserSessionData } from '../models/auth/user';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function deserializeUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const accessToken = _extractAccessToken(req);
  const refreshToken = _extractRefreshToken(req);

  if (!accessToken) {
    return next();
  }

  const { payload, expired } = verifyJWT(accessToken);
  // For a valid access token
  if (payload) {
    req.user = payload;
    return next();
  }

  //expired but valid access token
  const { payload: refresh } =
    expired && refreshToken ? verifyJWT(refreshToken) : { payload: null };

  if (!refresh) {
    return next();
  }

  const userData = await getUserSessionData(refresh.id);
  if (!userData) {
    return next();
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

  //* Note: In an ideal world, we would not pass the data back in the header
  //* but set the cookie, by doing say. This is because you no longer need to pass in values
  //* and the Access token is stored in a secure cookie, as a result of httpOnly:true.
  res.cookie('accessToken', accessToken, {
    maxAge: ACCESS_TOKEN_UPDATE_SECONDS,
    httpOnly: true,
    secure: true,
  });
  res.set('access_token', newAccessToken);
  req.user = verifyJWT(newAccessToken).payload;

  return next();
}

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

export default deserializeUser;
