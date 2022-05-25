import { Request, Response } from 'express';
import { registerUser, loginUser, updateUser, getUser } from '../services/user.service';
import { ValidationError } from '../errors/validation.error';
import { AuthRequest } from '../middlewares/auth.middleware';

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

export async function updateUserController(req: AuthRequest, res: Response) {
    const id = req.user.userId;
    const { name, email, password } = req.body;
    try {
        await updateUser(id, name, email, password);
    } catch (e) {
        if(e instanceof ValidationError) {
            return res.status(500).json(e.errors);
        }
        return res.status(500).json(e.message);
    }
    return res.status(200).json({success: true});
}

export async function getUserController(req: AuthRequest, res: Response) {
    const id = req.user.userId;
    let data;
    try {
        data = await getUser(id);
    } catch (e) {
        return res.status(500).json(e.message);
    }
    return res.status(200).json(data);
}



