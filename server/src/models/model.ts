import { ValidationError } from '../errors/validation.error';
import database, { ID_LENGTH } from '../database';
import { nanoid } from 'nanoid';
import { Knex } from 'knex';
import { isDBIgnored, Table } from './decorators';


@Table('')
export default abstract class Model {

    protected id: string | null;
    private TABLE_NAME: string;

    protected constructor(data: object) {
        this.fromDBObject(data);
    }

    public abstract validate(): string[];

    protected toDBObject(): any {
        const data = Object.getOwnPropertyDescriptors(this);
        const keys = Object.keys(data);
        let obj: any = {};
        for (let key of keys) {
            if (!isDBIgnored(this, key)) {
                const value = data[key]['value'];
                if (value) {
                    obj[key] = value;
                }
            }
        }
        return obj;
    }

    protected fromDBObject(data: any): void {
        for (let key of Object.keys(data)) {
            try {
                Object.defineProperty(this, key, {
                    value: data[key]
                });
            } catch (e) {}
        }
    }

    public async save(): Promise<void> {
        const validation = this.validate();
        if (validation.length > 0) {
            throw new ValidationError(validation);
        }
        if (this.id) {
            await this.update(this.id);
        } else {
            await this.add();
        }
    }

    protected async update(id: string): Promise<void> {
        await this.getQuery().update(this.toDBObject()).where('id', id);
    }

    protected async add(): Promise<void> {
        const id = await this.getFreeId();
        this.id = id;
        await this.getQuery().insert({ ...this.toDBObject(), id });
    }


    public getTableName(): string {
        return this.TABLE_NAME;
    }

    public static getTableName(): string {
        return this.prototype.TABLE_NAME;
    }

    protected getQuery(): Knex.QueryBuilder {
        return database(this.getTableName());
    }

    protected static getQuery(): Knex.QueryBuilder {
        return database(this.getTableName());
    }

    private async getFreeId(): Promise<string> {
        let id: string;
        let duplicate: any;
        do {
            id = nanoid(ID_LENGTH);
            duplicate = await this.getQuery().where('id', id).first();
        } while (duplicate != null);
        return id;
    }

}
