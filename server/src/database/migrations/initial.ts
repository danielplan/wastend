import { Knex } from 'knex';
import { ID_LENGTH } from '../index';

export async function up(knex: Knex): Promise<void> {
    return knex.schema
        .createTable('household', (table) => {
            table.string('id', ID_LENGTH).primary();
            table.string('name').notNullable();
        })
        .createTable('household_has_user', (table) => {
            table.string('household_id', ID_LENGTH).references('id').inTable('household').primary();
            table.string('user_id', ID_LENGTH).references('id').inTable('user').primary();
        })
        .createTable('user', (table) => {
            table.string('id', ID_LENGTH).primary();
            table.string('email').notNullable().index('user_email').unique();
            table.string('password_hash').notNullable();
            table.string('name').notNullable();
        })
        .createTable('user_session', (table) => {
            table.string('id', ID_LENGTH).primary();
            table.string('user_id', ID_LENGTH).references('id').inTable('user').notNullable();
        })
        .createTable('grocery_category', (table) => {
            table.string('id', ID_LENGTH).primary();
            table.string('name').notNullable();
        })
        .createTable('grocery', (table) => {
            table.string('id', ID_LENGTH).primary();
            table.string('name').notNullable();
            table.string('category_id', ID_LENGTH).references('id').inTable('grocery_category').notNullable();
        })
        .createTable('stock', (table) => {
            table.string('id', ID_LENGTH).primary();
            table.string('household_id', ID_LENGTH).references('id').inTable('household').notNullable();
            table.string('user_id', ID_LENGTH).references('id').inTable('user').notNullable();
            table.string('grocery_id', ID_LENGTH).references('id').inTable('grocery').notNullable();
        });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema
        .dropTable('user_session')
        .dropTable('user')
        .dropTable('stock')
        .dropTable('grocery')
        .dropTable('grocery_category')
        .dropTable('household')
        .dropTable('household_has_user');
}

