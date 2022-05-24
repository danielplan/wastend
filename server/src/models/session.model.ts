import Model from './model';
import { Table } from './decorators';

interface SessionData {
    id?: string,
    userId: string
}

@Table('user_session')
export default class Session extends Model {

    public id: string | null;
    public userId: string;

    constructor(data: SessionData) {
        super(data);
    }


    validate(): string[] {
        const errors: string[] = [];
        if (!this.userId) errors.push('No user defined for session');
        return errors;
    }

}