import Model from './model';
import { Table } from '../helpers/decorators.helpers';

interface GroceryData {
    id?: string;
    name: string;
}

@Table('grocery')
export default class Grocery extends Model {
    public id: string;
    public name: string;
    constructor(data: GroceryData) {
        super(data);
    }
    validate(): string[] {
        const errors: string[] = [];
        if (!this.name) errors.push('label.enter_name');
        return errors;
    }

    public static async getByName(name: string) {
        const grocery = await this.getQuery().where('name', name).first();
        return this.wrap(grocery);
    }

    static async getSimilar(name: string): Promise<Grocery[]> {
        const groceries = await this.getQuery().whereLike('name', name + '%').orderBy('name', 'asc').limit(5);
        return this.wrap(groceries);
    }
}