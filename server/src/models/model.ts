import { ValidationError } from '../errors/validation.error';
import database from '../database';
import { nanoid } from 'nanoid';
import { Knex } from 'knex';

export default abstract class Model {

    protected id: string;

    protected constructor(id?: string) {
        if (id) {
            this.get(id);
        }
    }

    public abstract get(id: string): void;

    protected abstract getTableName(): string;

    public abstract validate(): string[];

    public abstract toJSONObject(): any;

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
        await this.getQuery().update(this.toJSONObject()).where('id', id);
    }

    protected async add(): Promise<void> {
        const id = await this.getFreeId();
        await this.getQuery().insert({ ...this.toJSONObject(), id });
    }


    protected getQuery(): Knex.QueryBuilder {
        return database(this.getTableName());
    }


    private async getFreeId(): Promise<string> {
        let id: string;
        let duplicate: any;
        do {
            id = nanoid(15);
            duplicate = await this.getQuery().where('id', id).first();
        } while (duplicate != null);
        return id;
    }

}
