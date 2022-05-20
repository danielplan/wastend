import jwt from 'jsonwebtoken';

function signJWT(payload: object, expiresIn: string | number) {
    const privateKey = process.env.JWT_TOKEN;
    if (!privateKey) throw new Error('Define a private key in .env file!');
    return jwt.sign(payload, privateKey, {
        expiresIn: expiresIn,
    });
}

export function verifyJWT(token: string) {
}
