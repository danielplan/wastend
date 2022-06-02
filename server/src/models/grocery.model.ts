import Model from './model';
import { Table } from '../helpers/decorators.helpers';

interface IGrocery {
    id?: string;
    name: string;
    categoryId: number;
}

@Table('grocery')
export default class Grocery extends Model {
    public id: string;
    public name: string;
    constructor(data: IGrocery) {
        super(data);
    }
    validate(): string[] {
        return [];
    }

}