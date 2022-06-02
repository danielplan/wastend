import { getGrocery } from './grocery.service';
import Household from '../models/household.model';
import NotFoundError from '../errors/not_found.error';
import AuthError from '../errors/auth.error';
import { getStock } from './stock.service';

export async function addGrocery(name: string, amount: number, unit: string, householdId: string, idealAmount: number, userId: string) {
    const household = await Household.get(householdId) as Household;
    if(!household) throw new NotFoundError('household');
    if(!await household.hasAccess(userId)) throw new AuthError();
    const grocery = await getGrocery(name);
    const stock = await getStock(name, amount, unit, householdId, idealAmount, grocery.id);
    return {grocery, stock};
}