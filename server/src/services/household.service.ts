import Household from '../models/household.model';
import { AuthError } from '../errors/auth.error';

export async function updateHousehold(name: string, id: string, userId: string) {
    const household = await Household.get(id) as Household;
    if(await household.hasAccess(userId)) {
        household.name = name;
        await household.save();
    } else {
        throw new AuthError();
    }
}

export async function createHousehold(name: string, userId: string) {
    const household = new Household({name});
        await household.save();
        await household.addUser(userId);
        return household.toDBObject();
}

export async function getHouseholdsForUser(userId: string) {
    return Household.getForUser(userId);
}
