import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export function signJWT(payload: object, expiresIn: string | number) {
    const privateKey = process.env.JWT_TOKEN;
    if (!privateKey) throw new Error('Define a private key in .env file!');
    return jwt.sign(payload, privateKey, {
        expiresIn: expiresIn,
    });
}

export function verifyJWT(token: string) {
    try {
        const decoded = jwt.verify(token, process.env.JWT_TOKEN);
        return {payload: decoded, expired: false};
    } catch (error) {
        console.log(error);
        return {payload: null, expired: true};
    }
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