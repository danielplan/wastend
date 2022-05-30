import { NextFunction, Request, Response } from 'express';
import { registerUser, loginUser, updateUser, getUser } from '../services/user.service';
import { AuthRequest } from '../middlewares/auth.middleware';

export async function loginController(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;
    try {
        const tokens = await loginUser(email, password);
        return res.status(200).json(tokens);
    } catch (e) {
        return next(e);
    }
}

export async function registerController(req: Request, res: Response, next: NextFunction) {
    const { name, email, password } = req.body;

    try {
        const tokens = await registerUser(name, email, password);
        return res.status(200).json(tokens);
    } catch (e) {
        return next(e);
    }
}

export async function updateUserController(req: AuthRequest, res: Response, next: NextFunction) {
    const id = req.user.userId;
    const { name, email, password } = req.body;
    try {
        await updateUser(id, name, email, password);
        return res.status(200).json({ success: true });
    } catch (e) {
        return next(e);
    }
}

export async function getUserController(req: AuthRequest, res: Response, next: NextFunction) {
    const id = req.user.userId;
    try {
        const data = await getUser(id);
        return res.status(200).json(data);
    } catch (e) {
        return next(e);
    }
}



