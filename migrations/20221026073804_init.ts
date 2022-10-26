import { Knex } from 'knex';

const up = async (knex: Knex): Promise<void> => {
    await knex.schema.withSchema('public')
        .createTable('roles', (table) => {
            table.uuid('id').unique();
            table.string('name').notNullable();
        })
        .createTable('users', (table) => {
            table.uuid('id').unique();
            table.string('username').notNullable();
            table.string('firsname').notNullable();
            table.string('lastname').notNullable();
            table.string('email').notNullable();
            table.timestamps();
            table.boolean('deleted').defaultTo(false);
        })
        .createTable('users_roles', (table) => {
            table.uuid('user_id');
            table.uuid('role_id');
            table.foreign('user_id').references('users.id').onDelete('CASCADE');
            table.foreign('role_id').references('roles.id').onDelete('CASCADE');
        })
        .createTable('categories', (table) => {
            table.uuid('id');
            table.timestamps();
            table.boolean('deleted').defaultTo(false);
            table.string('name').notNullable();
            table.uuid('parent_id').nullable();
        });
};


const down = async (knex: Knex): Promise<void> => {
    await knex.schema.withSchema('public')
        .alterTable('users_roles', (table) => {
            table.dropForeign('user_id');
            table.dropForeign('role_id');
        })
        .dropTableIfExists('users_roles')
        .dropTableIfExists('users')
        .dropTableIfExists('roles')
        .dropTableIfExists('categories')
    ;
};

export { up, down };

