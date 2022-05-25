import Session from '../models/session.model';
import User from '../models/user.model';
import { signJWT } from '../helpers/auth.helpers';

export interface Tokens {
    accessToken: string;
    refreshToken: string;
}

export interface AccessToken {
    email: string,
    userId: string,
    sessionId: string
}

export interface RefreshToken {
    sessionId: string;
}

export async function createSession(user: User): Promise<Tokens> {
    const session = new Session({ userId: user.id });
    await session.save();

    const accessTokenContent: AccessToken = { email: user.email, userId: user.id, sessionId: session.id };
    const refreshTokenContent: RefreshToken = { sessionId: session.id };

    const accessToken = signJWT(accessTokenContent, '5m');
    const refreshToken = signJWT(refreshTokenContent, '1y');
    return {
        accessToken,
        refreshToken,
    };
}
