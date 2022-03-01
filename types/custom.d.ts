interface accessTokenUser {
  id?: string;
  email?: string;
  username?: string;
  sessionId?: any;
}

declare namespace Express {
  export interface Request {
    user?: accessTokenUser;
  }
}
