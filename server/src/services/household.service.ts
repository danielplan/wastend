import Household from '../models/household.model';
import AuthError from '../errors/auth.error';
import NotFoundError from '../errors/not_found.error';

export async function joinHousehold(id: string, userId: string) {
    const household = await Household.get(id) as Household;
    if(!household) throw new NotFoundError();
    await household.addUser(userId);
}


export async function updateHousehold(name: string, id: string, userId: string) {
    const household = await Household.get(id) as Household;
    if (!household) throw new NotFoundError();
    if (await household.hasAccess(userId)) {
        household.name = name;
        await household.save();
    } else {
        throw new AuthError();
    }
}

export async function createHousehold(name: string, userId: string) {
    const household = new Household({ name });
    await household.save();
    await household.addUser(userId);
    return household.toDBObject();
}

export async function getHouseholdsForUser(userId: string) {
    return Household.getForUser(userId);
}
