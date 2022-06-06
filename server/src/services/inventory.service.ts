import { getGrocery } from './grocery.service';
import NotFoundError from '../errors/not_found.error';
import { getStock } from './stock.service';
import Stock, { InventoryData } from '../models/stock.model';
import Grocery from '../models/grocery.model';
import AuthError from '../errors/auth.error';
import Household from '../models/household.model';

async function checkHousehold(householdId: string, userId: string): Promise<void> {
    const household = await Household.get(householdId) as Household;
    if (!household) throw new NotFoundError();
    if (!await household.hasAccess(userId)) throw new AuthError();
}

export async function getSimilarGroceries(name: string) {
    const groceries = await Grocery.getSimilar(name);
    return groceries.map(grocery => grocery.toDBObject());
}


export async function getInventory(householdId: string, userId: string): Promise<InventoryData[]> {
    await checkHousehold(householdId, userId);
    return await Stock.getInventory(householdId);
}


export async function updateStock(id: string, amount: number, unit: string, idealAmount: number, userId: string): Promise<void> {
    const stock = await Stock.get(id) as Stock;
    if (!stock) throw new NotFoundError('stock');

    await checkHousehold(stock.householdId, userId);
    stock.fromDBObject({ amount, unit, idealAmount });
    await stock.save();
}


export async function addGrocery(name: string, amount: number, unit: string, householdId: string, idealAmount: number, userId: string) {
    await checkHousehold(householdId, userId);
    const grocery = await getGrocery(name);

    const stock = await getStock(name, amount, unit, householdId, idealAmount, grocery.id);
    return { grocery, stock };
}