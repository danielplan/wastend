import Model from './model';
import {DBIgnore, Table} from './decorators';

interface UserData {
    id?: string,
    name: string,
    email: string,
    password?: string,
    passwordHash?: string
}

@Table('user')
export default class User extends Model {
    public id: string | null;
    public name: string;
    public email: string;
    @DBIgnore()
    public password: string;
    public passwordHash: string | null;

    constructor(data: UserData) {
        super(data);
    }

    validate(): string[] {
        const errors: string[] = [];
        if (!this.name || this.name.length <= 3)
            errors.push('label.name_too_short');
        if (!this.email || !/(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/.test(this.email))
            errors.push('label.invalid_email');
        if (this.password && this.password.length < 6 || this.passwordHash && this.passwordHash.length <= 0)
            errors.push('label.invalid_password');
        return errors;
    }

    protected async create(): Promise<void> {
        const sameEmail = await this.getQuery().where('email', this.email).first();
        if (sameEmail) {
            throw new Error('label.email_already_used');
        }
        await super.create();
    }

    static async getByEmail(email: string): Promise<User> | null {
        const result = await this.getQuery().where('email', email).first();
        return this.wrap(result);
    }

}
