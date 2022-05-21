import { Request, Response } from 'express';
import { registerUser, loginUser } from '../services/user.service';
import { ValidationError } from '../errors/validation.error';

export async function loginController(req: Request, res: Response) {
    const { email, password } = req.body;
    let tokens = null;
    try {
        tokens = await loginUser(email, password);
    } catch (e) {
        return res.status(500).json(e.message);
    }
    return res.status(200).json(tokens);

}

export async function registerController(req: Request, res: Response) {
    const { name, email, password } = req.body;
    let tokens = null;
    try {
        tokens = await registerUser(name, email, password);
    } catch (e) {
        if(e instanceof ValidationError) {
            return res.status(500).json(e.errors);
        }
        return res.status(500).json(e.message);
    }
    return res.status(200).json(tokens);
}

