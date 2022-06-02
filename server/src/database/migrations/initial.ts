import { Knex } from 'knex';
import { ID_LENGTH } from '../index';

export async function up(knex: Knex): Promise<void> {
    return knex.schema
        .createTable('user', (table) => {
            table.string('id', ID_LENGTH).primary();
            table.string('email').notNullable().index('user_email').unique();
            table.string('passwordHash').notNullable();
            table.string('name').notNullable();
        })
        .createTable('household', (table) => {
            table.string('id', ID_LENGTH).primary();
            table.string('name').notNullable();
        })
        .createTable('household_has_user', (table) => {
            table.string('id', ID_LENGTH).primary();
            table.string('householdId', ID_LENGTH).references('id').inTable('household');
            table.string('userId', ID_LENGTH).references('id').inTable('user');
        })
        .createTable('user_session', (table) => {
            table.string('id', ID_LENGTH).primary();
            table.string('userId', ID_LENGTH).references('id').inTable('user').notNullable();
        })
        .createTable('grocery', (table) => {
            table.string('id', ID_LENGTH).primary();
            table.string('name').notNullable();
        })
        .createTable('stock', (table) => {
            table.string('id', ID_LENGTH).primary();
            table.string('householdId', ID_LENGTH).references('id').inTable('household').notNullable();
            table.string('groceryId', ID_LENGTH).references('id').inTable('grocery').notNullable();
            table.decimal('amount').notNullable();
            table.decimal('idealAmount').notNullable();
            table.string('unit').notNullable();
        });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema
        .dropTable('user_session')
        .dropTable('user')
        .dropTable('stock')
        .dropTable('grocery')
        .dropTable('household')
        .dropTable('household_has_user');
}

