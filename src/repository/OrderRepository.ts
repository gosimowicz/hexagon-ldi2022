import _ from 'lodash';
import { Service } from 'typedi';

import { BaseOrder, Order, OrderedProductBase, PaymentBase } from './../models/Order';
import { BaseRepository } from './BaseRepository';

type OrderTableStructure = {
    id: string;
    user_id: string;
    created_at: Date;
    updated_at: Date;
}

type OrderedProductTableStructure = {
    order_id: string;
    product_id: string;
    price: number;
    amount: number;
    created_at: Date;
    updated_at: Date;
}

type PaymentTableStructure = {
    id: string;
    order_id: string;
    status: string;
    created_at: Date;
    updated_at: Date;
}

@Service()
export class OrderRepository extends BaseRepository {
    private static readonly TABLE_NAME = 'orders';
    private static readonly ORDERED_PRODUCTS_TABLE_NAME = ' ordered_products';
    private static readonly PAYMENTS_TABLE_NAME = 'payments';

    public async createOrders(allOrders: Order[]) {
        let savedChunks = 0;
        await this.withTransaction(async (trx) => {
            const chunks = _.chunk(allOrders, 1000);
            console.log(`saving orders, chunks: ${chunks.length}`);

            for await (const chunk of chunks) {
                await trx.insert(chunk.map(this.parseOrderToTable)).into(OrderRepository.TABLE_NAME);
                for (const order of chunk) {
                    await trx
                        .insert(order.orderedProducts.map(this.parseOrderedProductToTable))
                        .into(OrderRepository.ORDERED_PRODUCTS_TABLE_NAME);

                    if (order.payment) {
                        await trx.insert(this.parsePaymentToTable(order.payment)).into(OrderRepository.PAYMENTS_TABLE_NAME);
                    }
                }
                console.log(`Saved chunk: ${savedChunks++}`);
            }
        });
        console.log('Orders saved');
    }

    public async getMostPopularProducts(categoryIds: string[], limit?: number) {
        // DO NOT CHANGE
        const query = this.db
            .select('o.product_id as productId')
            .sum('o.amount as amount')
            .from(`${ OrderRepository.ORDERED_PRODUCTS_TABLE_NAME } AS o`)
            .groupBy('o.product_id')
            .orderByRaw('SUM(o.amount) DESC')
            .join('products as p', 'p.id', 'o.product_id')
            .whereIn('p.category_id', categoryIds);

        if (limit) {
            query.limit(limit);
        }

        const result = await query;

        return await new Promise((resolve) => setTimeout(() => resolve(result), 1000));
    }

    private parseOrderToTable(order: BaseOrder): OrderTableStructure {
        return {
            id: order.id,
            user_id: order.userId,
            created_at: order.createAt,
            updated_at: order.updatedAt
        };
    }

    private parseOrderedProductToTable(orderedProduct: OrderedProductBase): OrderedProductTableStructure {
        return {
            order_id: orderedProduct.orderId,
            product_id: orderedProduct.productId,
            price: orderedProduct.price,
            amount: orderedProduct.amount,
            created_at: orderedProduct.createdAt,
            updated_at: orderedProduct.updatedAt,
        };
    }

    private parsePaymentToTable(payment: PaymentBase): PaymentTableStructure {
        return {
            id: payment.id,
            order_id: payment.orderId,
            status: payment.status,
            created_at: payment.createdAt,
            updated_at: payment.updatedAt,
        };
    }
}