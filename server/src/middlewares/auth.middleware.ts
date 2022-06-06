import { NextFunction, Request, Response } from 'express';
import { signJWT, verifyJWT } from '../helpers/auth.helpers';
import Session from '../models/session.model';
import { AccessToken, RefreshToken } from '../services/auth.service';
import AuthError from '../errors/auth.error';

export interface AuthRequest extends Request {
    user: AccessToken;
}

export default async function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
    const accessToken = req.headers['access-token'] as string;
    const refreshToken = req.headers['refresh-token'] as string;

    if (!accessToken) {
        return next(new AuthError());
    }


    let { expired, payload } = verifyJWT(accessToken);

    if (payload) {
        req.user = payload as AccessToken;
        return next();
    }

    payload = expired && refreshToken ? verifyJWT(refreshToken).payload as RefreshToken : null;

    if (!payload) {
        return next(new AuthError());
    }

    const session = await Session.get(payload.sessionId) as Session;

    if (!session) {
        return next(new AuthError());
    }

    const newAccessToken = signJWT(session, '5s');

    req.user = verifyJWT(newAccessToken).payload as AccessToken;

    res.setHeader('access-token', newAccessToken);
    return next();
}