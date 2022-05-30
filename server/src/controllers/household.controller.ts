import { NextFunction, Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import {
    createHousehold,
    getHouseholdsForUser,
    updateHousehold,
    joinHousehold,
    deleteHousehold,
} from '../services/household.service';

export async function joinHouseholdController(req: AuthRequest, res: Response, next: NextFunction) {
    const userId = req.user.userId;
    const id = req.params.id;
    try {
        await joinHousehold(id, userId);
        return res.status(200).json({ success: true });
    } catch (e) {
        return next(e);
    }
}

export async function deleteHouseholdController(req: AuthRequest, res: Response, next: NextFunction) {
    const userId = req.user.userId;
    const id = req.params.id;
    try {
        await deleteHousehold(id, userId);
        return res.status(200).json({ success: true });
    } catch (e) {
        return next(e);
    }
}

export async function updateHouseholdController(req: AuthRequest, res: Response, next: NextFunction) {
    const userId = req.user.userId;
    const id = req.params.id;
    const { name } = req.body;
    try {
        await updateHousehold(name, id, userId);
        return res.status(200).json({ success: true });
    } catch (e) {
        return next(e);
    }
}


export async function createHouseholdController(req: AuthRequest, res: Response, next: NextFunction) {
    const userId = req.user.userId;
    const { name } = req.body;
    try {
        const household = await createHousehold(name, userId);
        return res.status(200).json(household);
    } catch (e) {
        return next(e);
    }
}

export async function getHouseholdsController(req: AuthRequest, res: Response, next: NextFunction) {
    const userId = req.user.userId;
    try {
        const households = await getHouseholdsForUser(userId);
        return res.status(200).json(households);
    } catch (e) {
        return next(e);
    }
}



