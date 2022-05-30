import { NextFunction, Response } from 'express';
import AuthError from '../errors/auth.error';
import NotFoundError from '../errors/not_found.error';
import { AuthRequest } from './auth.middleware';
import ValidationError from '../errors/validation.error';


export default async function handleErrors(err: Error, req: AuthRequest, res: Response, next: NextFunction) {
    await next(err);
    if (err instanceof AuthError) {
        return res.status(401).json();
    }
    if (err instanceof NotFoundError) {
        return res.status(404).json();
    }
    if (err instanceof ValidationError) {
        return res.status(500).json(err.errors);
    }
    return res.status(500).json(err.message);
}


