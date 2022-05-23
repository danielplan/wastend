import Model, { Table } from './model';

@Table('user_session')
export default class Session extends Model {

    public id: string | null;
    public userId: string;

    constructor(data: { id?: string, userId: string }) {
        super(data);
    }

    protected fromDBObject(data: { id?: string, userId: string }): void {
        const { id, userId } = data;
        this.id = id;
        this.userId = userId;
    }

    protected toDBObject(): any {
        return {
            id: this.id,
            userId: this.userId,
        };
    }

    validate(): string[] {
        const errors: string[] = [];
        if (!this.userId) errors.push('No user defined for session');
        return errors;
    }

}