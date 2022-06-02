import { AuthRequest } from '../middlewares/auth.middleware';
import { addGrocery } from '../services/inventory.service';
import { NextFunction, Response } from 'express';

export async function addGroceryController(req: AuthRequest, res: Response, next: NextFunction) {
    const userId = req.user.userId;

    const { name, amount: amountRaw, unit, householdId, idealAmount: idealAmountRaw } = req.body;
    const amount = Number.parseFloat(amountRaw);
    const idealAmount = Number.parseFloat(idealAmountRaw);
    try {
        const grocery = await addGrocery(name, amount, unit, householdId, idealAmount, userId);
        return res.status(200).json(grocery);
    } catch (e) {
        return next(e);
    }
}