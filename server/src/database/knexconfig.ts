import { Knex } from 'knex';

export interface KnexConfig {
    development: Knex.Config;
    test: Knex.Config;
    staging: Knex.Config;
    production: Knex.Config;
}

const knexConfig: KnexConfig = {
    development: {
        client: 'sqlite3',
        useNullAsDefault: true,
        connection: {
            filename: './dev.sqlite3',
        },
        migrations: {
            tableName: 'knex_migrations',
            directory: __dirname + '/migrations',
        },
    },

    test: {
        client: 'sqlite3',
        useNullAsDefault: true,
        connection: {
            filename: ':memory:',
        },
        migrations: {
            tableName: 'knex_migrations',
            directory: __dirname + '/migrations',
        },
    },

    staging: {
        client: 'postgresql',
        connection: {
            database: 'my_db',
            user: 'username',
            password: 'password',
        },
        pool: {
            min: 2,
            max: 10,
        },
        migrations: {
            tableName: 'knex_migrations',
            directory: __dirname + '/migrations',
        },
    },

    production: {
        client: 'postgresql',
        connection: {
            database: 'my_db',
            user: 'username',
            password: 'password',
        },
        pool: {
            min: 2,
            max: 10,
        },
        migrations: {
            tableName: 'knex_migrations',
        },
    },
};
export default knexConfig;

