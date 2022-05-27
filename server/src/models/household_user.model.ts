import Model from './model';
import { Table } from './decorators';

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

}