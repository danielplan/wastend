import { ValidationError } from '../errors/validation.error';
import database, { ID_LENGTH } from '../database';
import { nanoid } from 'nanoid';
import { Knex } from 'knex';

export default abstract class Model {

    protected id: string | null;

    protected constructor(data?: any) {
        if (data) {
            if (typeof data == 'string') {
                this.get(data);
            } else {
                this.fromJsonObject(data);
            }
        }
    }

    protected get(id: string): void {
        const result = this.getQuery().where('id', id).first();
        this.fromJsonObject(result);
    }

    protected abstract getTableName(): string;

    public abstract validate(): string[];

    protected abstract toDBObject(): any;

    protected abstract fromJsonObject(data: any): void;

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
        await this.getQuery().insert({ ...this.toDBObject(), id});
    }


    protected getQuery(): Knex.QueryBuilder {
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
