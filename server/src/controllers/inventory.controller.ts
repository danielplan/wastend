import { AuthRequest } from '../middlewares/auth.middleware';
import { addGrocery, getInventory, getSimilarGroceries, updateStock } from '../services/inventory.service';
import { NextFunction, Response } from 'express';

export async function updateStockController(req: AuthRequest, res: Response, next: NextFunction) {
    const userId = req.user.userId;
    const id = req.params.id;
    const { amount, unit, idealAmount } = req.body;
    try {
        const stock = await updateStock(id, amount, unit, idealAmount, userId);
        return res.status(200).json(stock);
    } catch (e) {
        return next(e);
    }
}


export async function addGroceryController(req: AuthRequest, res: Response, next: NextFunction) {
    const userId = req.user.userId;

    const { name, amount, unit, householdId, idealAmount } = req.body;
    try {
        const grocery = await addGrocery(name, amount, unit, householdId, idealAmount, userId);
        return res.status(200).json(grocery);
    } catch (e) {
        return next(e);
    }
}

export async function getInventoryController(req: AuthRequest, res: Response, next: NextFunction) {
    const userId = req.user.userId;
    const householdId = req.params.id;
    try {
        const grocery = await getInventory(householdId, userId);
        return res.status(200).json(grocery);
    } catch (e) {
        return next(e);
    }
}


export async function getSimilarGroceriesController(req: AuthRequest, res: Response, next: NextFunction) {
    const name = req.params.name;
    try {
        const grocery = await getSimilarGroceries(name);
        return res.status(200).json(grocery);
    } catch (e) {
        return next(e);
    }
}