import { Knex } from 'knex';

const up = async (knex: Knex): Promise<void> => {
    await knex.schema.withSchema('public')
        .createTable('orders', (table) => {
            table.uuid('id').unique();
            table.uuid('user_id').nullable();
            table.timestamps();

            table.foreign('user_id').references('users.id').onDelete('SET NULL');
        })
        .createTable('ordered_products', (table) => {
            table.uuid('order_id');
            table.uuid('product_id');
            table.decimal('price');
            table.integer('amount');
            table.timestamps();

            table.foreign('order_id').references('orders.id');
            table.foreign('product_id').references('products.id');
            table.unique(['order_id', 'product_id']);
        })
        .createTable('payments', (table) => {
            table.uuid('id').unique();
            table.uuid('order_id');
            table.string('status');
            table.timestamps();

            table.foreign('order_id').references('orders.id');
        })
        .alterTable('products', (table) => {
            table.decimal('price');
        })
    ;
};

const down = async (knex: Knex): Promise<void> => {
    await knex.schema.withSchema('public')
        .alterTable('orders', (table) => {
            table.dropForeign('user_id');
        })
        .alterTable('ordered_products', (table) => {
            table.dropForeign('order_id');
            table.dropForeign('product_id');
        })
        .alterTable('payments', (table) => {
            table.dropForeign('order_id');
        })
        .alterTable('products', (table) => {
            table.dropColumn('price');
        })
        .dropTableIfExists('orders')
        .dropTableIfExists('orders_products')
        .dropTableIfExists('payments')
    ;
};

export { up, down };

