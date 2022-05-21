import Model from './model';

export default class Session extends Model {

    public id: string | null;
    public userId: string;

    constructor(data?: any) {
        super(data);
    }

    protected fromJsonObject(data: any): void {
        const { id, user_id } = data;
        this.id = id;
        this.userId = user_id;
    }

    protected getTableName(): string {
        return 'user_session';
    }

    protected toDBObject(): any {
        return {
            id: this.id,
            user_id: this.userId,
        };
    }

    validate(): string[] {
        const errors: string[] = [];
        if (!this.userId) errors.push('No user defined for session');
        return errors;
    }

}