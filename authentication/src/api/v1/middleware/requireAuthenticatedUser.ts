import { NextFunction, Request, Response } from 'express';

export function requireAuthenticatedUser(
    req: Request,
    res: Response,
    next: NextFunction,
): any {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (!req.user) {
        return res.status(403).json({
            status: 'error',
            message: 'Authorization failed. Try logging in again.',
        });
    }

    next();
    return;
}
