import { BaseProduct } from './../models/Product';
import { chunk } from '../utils/arrays';
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
}

@Service()
export class ProductRepository extends BaseRepository {
    private static readonly TABLE_NAME = 'products';

    public async createProducts(allProducts: ReadonlyArray<BaseProduct>) {
        await this.withTransaction(async (trx) => {
            const chunks = chunk(allProducts, 1000);

            for await (const users of chunks) {
                await trx.insert(users.map(this.parseToTable)).into(ProductRepository.TABLE_NAME);
            }
        });
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
            deleted: product.deleted
        };
    }
}