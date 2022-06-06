import Model from './model';
import { Table } from '../helpers/decorators.helpers';

interface HouseholdData {
    id?: string,
    householdId: string
    userId: string
}

@Table('household_has_user')
export default class HouseholdHasUser extends Model {

    public id: string | null;
    public userId: string;
    public householdId: string;

    constructor(data: HouseholdData) {
        super(data);
    }

    validate(): string[] {
        const errors: string[] = [];
        if (!this.userId) errors.push('No user id given in household creation');
        if (!this.householdId) errors.push('No household id given household creation');
        return errors;
    }

    public static async checkAccess(userId: string, householdId: string): Promise<boolean> {
        const result = await HouseholdHasUser.getQuery().where('householdId', householdId).where('userId', userId).first();
        return !!result;
    }
}