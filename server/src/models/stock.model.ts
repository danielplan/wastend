import Model from './model';
import { Table } from '../helpers/decorators.helpers';
import Household from './household.model';
import Grocery from './grocery.model';

interface StockData {
    id?: string;
    groceryId: string;
    householdId: string;
    amount: number;
    unit: string;
    idealAmount: number;
}


export interface InventoryData extends StockData {
    grocery: string;
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
        if(this.amount == null || isNaN(this.amount) || this.amount < 0) errors.push('label.enter_amount');
        if(this.idealAmount == null || isNaN(this.idealAmount) || this.idealAmount <= 0) errors.push('label.enter_ideal_amount');
        if(!this.unit) errors.push('label.enter_unit');
        return errors;
    }

    public static async getForHousehold(groceryId: string, householdId: string): Promise<Stock> {
        const stock = await this.getQuery().where('groceryId', groceryId).where('householdId', householdId).first();
        return this.wrap(stock);
    }

    public static async getInventory(householdId: string): Promise<InventoryData[]> {
        return this.getQuery()
            .where('householdId', householdId)
            .join(Grocery.getTableName(), 'groceryId', '=', 'grocery.id')
            .select('stock.id as id', 'grocery.name as grocery', 'stock.amount as amount', 'stock.unit as unit', 'stock.idealAmount as idealAmount');
    }

    public async getHousehold(): Promise<Household> {
        return await Household.get(this.householdId) as Household;
    }

}