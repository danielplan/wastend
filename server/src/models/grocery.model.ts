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
        return [];
    }

    public static async getByName(name: string) {
        return this.getQuery().where('name', name).first();
    }

}