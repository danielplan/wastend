import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { createHousehold, getHouseholdsForUser, updateHousehold } from '../services/household.service';
import { ValidationError } from '../errors/validation.error';
import { AuthError } from '../errors/auth.error';

export async function updateHouseholdController(req: AuthRequest, res: Response) {
    const userId = req.user.userId;
    const id = req.params.id;
    const { name } = req.body;
    try {
        await updateHousehold(name, id, userId);
    } catch (e) {
        if(e instanceof ValidationError) {
            return res.status(500).json(e.errors);
        }
        if(e instanceof AuthError) {
            return res.status(401).json();
        }
        return res.status(500).json(e.message);
    }
    return res.status(200).json({success: true});
}


export async function createHouseholdController(req: AuthRequest, res: Response) {
    const userId = req.user.userId;
    const { name } = req.body;
    let household = null;
    try {
        household = await createHousehold(name, userId);
    } catch (e) {
        if (e instanceof ValidationError) {
            return res.status(500).json(e.errors);
        }
        return res.status(500).json(e.message);
    }
    return res.status(200).json(household);
}

export async function getHouseholdsController(req: AuthRequest, res: Response) {
    const userId = req.user.userId;
    let households = null;
    try {
        households = await getHouseholdsForUser(userId);
    } catch (e) {
        return res.status(500).json(e.message);
    }
    return res.status(200).json(households);
}



