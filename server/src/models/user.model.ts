import Model from './model';
import database from '../database';

export default class User extends Model {
    public id: string | null;
    public name: string;
    public email: string;
    public password: string;
    public passwordHash: string | null;
    public readonly TABLE_NAME: string = 'user';
    public static readonly TABLE_NAME: string = 'user';

    constructor(data: { id?: string, name: string, email: string, password: string, passwordHash: string }) {
        super(data);
    }

    validate(): string[] {
        const errors: string[] = [];
        if (this.name.length <= 3)
            errors.push('label.name_too_short');
        if (!/(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/.test(this.email))
            errors.push('label.invalid_email');
        if (this.password != null && this.password.length < 6 || this.passwordHash == null)
            errors.push('label.invalid_password');
        return errors;
    }

    protected fromDBObject(data: any): void {
        const { id, name, email, passwordHash, password } = data;
        this.id = id;
        this.name = name;
        this.email = email;
        this.passwordHash = passwordHash;
        this.password = password;
    }

    protected async add(): Promise<void> {
        const sameEmail = await this.getQuery().where('email', this.email).first();
        if (sameEmail) {
            throw new Error('label.email_already_used');
        }
        await super.add();
    }

    protected toDBObject(): any {
        return {
            name: this.name,
            email: this.email,
            passwordHash: this.passwordHash,
        };
    }

    static async getByEmail(email: string): Promise<User> | null {
        const result = await User.getQuery().where('email', email).first();
        if (!result) return null;
        return new User(result);
    }

}
