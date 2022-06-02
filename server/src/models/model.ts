import ValidationError from '../errors/validation.error';
import database, { ID_LENGTH } from '../database';
import { nanoid } from 'nanoid';
import { Knex } from 'knex';
import { isDBIgnored, Table } from '../helpers/decorators.helpers';


@Table('')
export default abstract class Model {

    protected id: string | null;
    private TABLE_NAME: string;

    protected constructor(data: object) {
        this.fromDBObject(data);
    }

    public abstract validate(): string[];

    public static async get(id: string): Promise<Model> | null {
        if(!id) {
            throw new Error('No id given at get');
        }
        const result = await this.getQuery().where('id', id).first();
        return this.wrap(result);
    }

    public toDBObject(): any {
        const data = Object.getOwnPropertyDescriptors(this);
        const keys = Object.keys(data);
        let obj: any = {};
        for (let key of keys) {
            if (!isDBIgnored(this, key)) {
                const value = data[key]['value'];
                if (value != null) {
                    obj[key] = value;
                }
            }
        }
        return obj;
    }

    public fromDBObject(data: any): void {
        for (let key of Object.keys(data)) {
            if(data[key] != null) {
                try {
                    Object.defineProperty(this, key, {
                        value: data[key],
                        writable: true,
                        configurable: true,
                        enumerable: true,
                    });
                } catch (e) {
                }
            }
        }
    }

    public async save(): Promise<void> {
        const validation = this.validate();
        if (validation.length > 0) {
            throw new ValidationError(validation);
        }
        if (this.id) {
            await this.update();
        } else {
            await this.create();
        }
    }

    protected async update(): Promise<void> {
        await this.getQuery().update(this.toDBObject()).where('id', this.id);
    }

    protected async create(): Promise<void> {
        const id = await this.getFreeId();
        this.id = id;
        await this.getQuery().insert({ ...this.toDBObject(), id });
    }
    public async delete() {
        await this.getQuery().delete().where('id', this.id);
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

    protected static wrap(data: any) {
        if(data == null) return null;
        if (Array.isArray(data)) {
            return data.map((d: any) => this.wrapSingle(d));
        }
        return this.wrapSingle(data);
    }

    private static wrapSingle(data: any) {
        let obj: any = {};

        for (let key of Object.keys(data)) {
            obj[key] = {
                writable: true,
                configurable: true,
                enumerable: true,
                value: data[key],
            };
        }
        return Object.create(this.prototype, obj);
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
