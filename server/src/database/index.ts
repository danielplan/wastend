import knex, { Knex } from 'knex';
import knexConfig from '../../knexfile';

export const ID_LENGTH = 15;

const environment: string = process.env.NODE_ENV || 'development';
// @ts-ignore
const config: Knex.Config = knexConfig ? knexConfig[environment] : {};

export const database = knex(config);

export function migrate() {
    return database.migrate.latest();
}

export function close() {
    return database.destroy();
}


export default database;

