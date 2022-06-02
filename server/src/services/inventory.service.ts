import { getGrocery } from './grocery.service';
import Household from '../models/household.model';
import NotFoundError from '../errors/not_found.error';
import AuthError from '../errors/auth.error';
import { getStock } from './stock.service';
import Stock, { InventoryData } from '../models/stock.model';
import Grocery from '../models/grocery.model';

export async function getSimilarGroceries(name: string) {
    const groceries = await Grocery.getSimilar(name);
    return groceries.map(grocery => grocery.toDBObject());
}


export async function getInventory(householdId: string, userId: string): Promise<InventoryData[]> {
    const household = await Household.get(householdId) as Household;
    if (!household) throw new NotFoundError();
    if (!await household.hasAccess(userId)) throw new AuthError();
    return await Stock.getInventory(householdId);
}


export async function updateStock(id: string, amount: number, unit: string, idealAmount: number, userId: string): Promise<void> {
    const stock = await Stock.get(id) as Stock;
    if (!stock) throw new NotFoundError('stock');

    const household = await stock.getHousehold();
    if (!household) throw new NotFoundError('household');
    if (!await household.hasAccess(userId)) throw new AuthError();

    stock.fromDBObject({ amount, unit, idealAmount });
    await stock.save();
}


export async function addGrocery(name: string, amount: number, unit: string, householdId: string, idealAmount: number, userId: string) {
    const household = await Household.get(householdId) as Household;
    if (!household) throw new NotFoundError('household');
    if (!await household.hasAccess(userId)) throw new AuthError();

    const grocery = await getGrocery(name);

    const stock = await getStock(name, amount, unit, householdId, idealAmount, grocery.id);
    return { grocery: grocery.toDBObject(), stock: stock.toDBObject() };
}