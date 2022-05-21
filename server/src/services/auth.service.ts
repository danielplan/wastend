import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import Session from '../models/session.model';
import User from '../models/user.model';

export interface Tokens {
    accessToken: string;
    refreshToken: string;
}

function signJWT(payload: object, expiresIn: string | number) {
    const privateKey = process.env.JWT_TOKEN;
    if (!privateKey) throw new Error('Define a private key in .env file!');
    return jwt.sign(payload, privateKey, {
        expiresIn: expiresIn,
    });
}

export async function encryptPassword(password: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        bcrypt.genSalt(10, function(error, salt) {
            if(error) reject(error);
            bcrypt.hash(password, salt, function(err, hash) {
                if(error) reject(error);
                resolve(hash);
            });
        });
    });
}

export async function comparePasswords(password: string, passwordHash: string): Promise<boolean> {
    return bcrypt.compare(password, passwordHash);
}

export async function createSession(user: User): Promise<Tokens> {
    const session = new Session({user_id: user.id});
    await session.save();
    const accessToken = signJWT({email: user.email, userId: user.id, sessionId: session.id}, "5m");
    const refreshToken = signJWT({sessionId: session.id}, "1y");
    return {
        accessToken,
        refreshToken
    }
}
