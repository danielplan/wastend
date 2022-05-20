import { Request, Response } from 'express';
import { registerUser, loginUser } from '../services/user.service';
import { ValidationError } from '../errors/validation.error';

export function loginController(req: Request, res: Response) {
    const { email, password } = req.body;
    try {
        loginUser(email, password);
    } catch (e) {}
}

export async function registerController(req: Request, res: Response) {
    const { name, email, password } = req.body;
    let session = null;
    try {
        session = await registerUser(name, email, password);
    } catch (e) {
        if(e instanceof ValidationError) {
            return res.status(500).send(e.errors);
        }
        return res.status(500).send(e.message);
    }
    return res.status(200).send(session);
}

