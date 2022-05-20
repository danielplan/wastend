import Model from './model';

export default class User extends Model {
    protected update(id: string): Promise<void> {
        throw new Error('Method not implemented.');
    }

    public id: string | null;
    public name: string;
    public email: string;
    public password: string;
    public passwordHash: string | null;

    constructor(id?: string) {
        super(id);
    }

    get(id: string): void {
    }

    validate(): string[] {
        const errors: string[] = [];
        if (this.name.length <= 3)
            errors.push('label.name_too_short');
        if (!/(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/.test(this.email))
            errors.push('label.invalid_email');
        if (this.password.length < 6)
            errors.push('label.invalid_password');
        return errors;
    }

    protected async add(): Promise<void> {
        const sameEmail = await this.getQuery().where('email', this.email).first();
        if(sameEmail) {
            throw new Error('label.email_already_used');
        }
        await super.add();
    }

    toJSONObject(): any {
        return {
            name: this.name,
            email: this.email,
            password_hash: this.password
        }
    }

    protected getTableName(): string {
        return 'user';
    }

}
