import { Knex } from 'knex';
import { nanoid } from 'nanoid';

export async function up(knex: Knex): Promise<void> {
    const uuid = knex.raw('nanoid(15)');
    return knex.schema
        .createTable('household', (table) => {
            table.string('id', 15).primary();
            table.string('name').notNullable();
        })
        .createTable('household_has_user', (table) => {
            table.string('household_id', 15).references('id').inTable('household').primary();
            table.string('user_id', 15).references('id').inTable('user').primary();
        })
        .createTable('user', (table) => {
            table.string('id', 15).primary();
            table.string('email').notNullable().index('user_email').unique();
            table.string('password_hash').notNullable();
            table.string('name').notNullable();
        })
        .createTable('user_session', (table) => {
            table.string('id', 15).primary();
            table.string('refresh_token').notNullable();
        })
        .createTable('grocery_category', (table) => {
            table.string('id', 15).primary();
            table.string('name').notNullable();
        })
        .createTable('grocery', (table) => {
            table.string('id', 15).primary();
            table.string('name').notNullable();
            table.string('category_id').references('id').inTable('grocery_category');
        })
        .createTable('stock', (table) => {
            table.string('id', 15).primary();
            table.string('household_id', 15).references('id').inTable('household').primary();
            table.string('user_id', 15).references('id').inTable('user').primary();
            table.string('grocery_id', 15).references('id').inTable('grocery').primary();
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

