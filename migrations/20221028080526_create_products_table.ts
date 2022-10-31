import { Knex } from 'knex';

const up = async (knex: Knex): Promise<void> => {
    await knex.schema.withSchema('public')
        .alterTable('categories', (table) => {
            table.unique(['id']);
        })
        .createTable('products', (table) => {
            table.uuid('id').unique();
            table.string('name').notNullable();
            table.uuid('created_by_id').nullable();
            table.uuid('updated_by_id').nullable();
            table.uuid('category_id').notNullable();
            table.timestamps();
            table.boolean('deleted').defaultTo(false);

            table.foreign('created_by_id').references('users.id').onDelete('SET NULL');
            table.foreign('updated_by_id').references('users.id').onDelete('SET NULL');
            table.foreign('category_id').references('categories.id').onDelete('CASCADE');
        })
    ;
};

const down = async (knex: Knex): Promise<void> => {
    await knex.schema.withSchema('public')
        .alterTable('products', (table) => {
            table.dropForeign('created_by_id');
            table.dropForeign('updated_by_id');
            table.dropForeign('category_id');
        })
        .dropTableIfExists('products')
        .alterTable('categories', (table) => {
            table.dropUnique(['id']);
        })
    ;
};

export { up, down };

