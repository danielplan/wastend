import Model from './model';
import { Table } from '../helpers/decorators.helpers';
import HouseholdHasUser from './household_user.model';

export interface HouseholdData {
    id?: string,
    name: string
}

@Table('household')
export default class Household extends Model {

    public id: string | null;
    public name: string;

    constructor(data: HouseholdData) {
        super(data);
    }

    public async addUser(userId: string) {
        const connection = new HouseholdHasUser({
            userId,
            householdId: this.id,
        });
        return connection.save();
    }

    public async hasAccess(userId: string): Promise<boolean> {
        const connection = await HouseholdHasUser.getQuery().where('householdId', this.id).where('userId', userId).first();
        return !!connection;
    }

    public static async getForUser(userId: string) {
        const connections = await this.getQuery().select('householdId as id', 'name').join('household_has_user', 'household_has_user.householdId', '=', 'household.id').where('household_has_user.userId', userId);
        return this.wrap(connections);
    }

    validate(): string[] {
        const errors: string[] = [];
        if (!this.name) errors.push('label.enter_name');
        return errors;
    }

}