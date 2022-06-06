import Household from '../models/household.model';
import AuthError from '../errors/auth.error';
import NotFoundError from '../errors/not_found.error';

async function getHousehold(householdId: string, userId: string): Promise<Household> {
    const household = await Household.get(householdId) as Household;
    if (!household) throw new NotFoundError();
    if (!await household.hasAccess(userId)) throw new AuthError();
    return household;
}

export async function deleteHousehold(id: string, userId: string) {
    const household = await getHousehold(id, userId);
    await household.delete();
}


export async function joinHousehold(id: string, userId: string) {
    const household = await Household.get(id) as Household;
    if (!household) throw new NotFoundError();
    await household.addUser(userId);
}


export async function updateHousehold(name: string, id: string, userId: string) {
    const household = await getHousehold(id, userId);
    household.name = name;
    await household.save();
}

export async function createHousehold(name: string, userId: string) {
    const household = new Household({ name });
    await household.save();
    await household.addUser(userId);
    return household;
}

export async function getHouseholdsForUser(userId: string) {
    return Household.getForUser(userId);
}
