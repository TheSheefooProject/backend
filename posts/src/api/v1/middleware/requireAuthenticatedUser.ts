import { NextFunction, Request, Response } from 'express';

import axios from 'axios';

export async function requireAuthenticatedUser(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> {
  const accessToken = _extractAccessToken(req);
  const refreshToken = _extractRefreshToken(req);

  //Setting up the db connection
  const connectionString =
    'http://authentication-server:3000/v1/internal/verify';

  const headers = {
    headers: {
      Authorization: 'Bearer ' + accessToken,
      refresh_token: refreshToken,
    },
  };
  try {
    const userData = await axios.get(connectionString, headers);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    req.user = userData.data.payload;
  } catch (error) {
    res.status(401).json(error.response.data);
    return;
  }
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
