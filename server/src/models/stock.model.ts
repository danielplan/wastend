import Model from './model';
import { Table } from '../helpers/decorators.helpers';

interface StockData {
    id?: string;
    groceryId: string;
    householdId: string;
    amount: number;
    unit: string;
    idealAmount: number;
}

@Table('stock')
export default class Stock extends Model {
    public id: string;
    public name: string;
    public groceryId: string;
    public amount: number;
    public unit: string;
    public idealAmount: number;
    public householdId: string;

    constructor(data: StockData) {
        super(data);
    }
    validate(): string[] {
        const errors = [];
        if(!this.groceryId) errors.push('Grocery not found');
        if(!this.householdId) errors.push('Household not found');
        if(!this.amount || !Number.parseFloat(this.amount.toString()) || this.amount < 0) errors.push('label.enter_amount');
        if(!this.idealAmount || !Number.parseFloat(this.idealAmount.toString()) || this.idealAmount < 0) errors.push('label.enter_ideal_amount');
        if(!this.unit) errors.push('label.enter_unit');
        return errors;
    }

    public static async getForHousehold(groceryId: string, houseHoldId: string) {
        return this.getQuery().where('groceryId', groceryId).where('householdId', houseHoldId).first();
    }

}