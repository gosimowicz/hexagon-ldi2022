import _ from 'lodash';

import { BaseProduct } from './../models/Product';
import { BaseRepository } from './BaseRepository';
import { Service } from 'typedi';

type TableStructure = {
    id: string,
    name: string,
    category_id: string,
    created_by_id: string | null,
    updated_by_id: string | null,
    updated_at: Date,
    created_at: Date,
    deleted: boolean,
    price: number,
}

@Service()
export class ProductRepository extends BaseRepository {
    private static readonly TABLE_NAME = 'products';

    public async getAllProducts(): Promise<BaseProduct[]> {
        const tableEntries = await this.db.select<TableStructure[]>().from(ProductRepository.TABLE_NAME);

        return tableEntries.map(this.parseTableToProduct);
    }

    public async createProducts(allProducts: ReadonlyArray<BaseProduct>) {
        await this.withTransaction(async (trx) => {
            const chunks = _.chunk(allProducts, 1000);

            for await (const users of chunks) {
                await trx.insert(users.map(this.parseToTable)).into(ProductRepository.TABLE_NAME);
            }
        });
    }

    public parseTableToProduct(entry: TableStructure): BaseProduct {
        return new BaseProduct(
            entry.id,
            entry.name,
            entry.created_by_id,
            entry.updated_by_id,
            entry.category_id,
            entry.price,
            entry.created_at,
            entry.updated_at,
            entry.deleted
        );
    }

    private parseToTable(product: BaseProduct): TableStructure {
        return {
            id: product.id,
            name: product.name,
            category_id: product.categoryId,
            created_by_id: product.createdById,
            updated_by_id: product.updatedById,
            created_at: product.createdAt,
            updated_at: product.updatedAt,
            deleted: product.deleted,
            price: product.price,
        };
    }
}