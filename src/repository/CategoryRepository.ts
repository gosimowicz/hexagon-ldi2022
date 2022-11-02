import { Knex } from 'knex';
import { Service } from 'typedi';
import { BaseCategory, Category } from '../models/Category';
import { BaseRepository } from './BaseRepository';

type TableStructure = {
    id: string,
    created_at: Date,
    updated_at: Date,
    name: string,
    deleted: boolean,
    parent_id: string | null,
}

@Service()
export class CategoryRepository extends BaseRepository {
    private static readonly TABLE_NAME = 'categories';

    async createCategories(categories: ReadonlyArray<Category>) {
        await Promise.all(categories.map((category) => this.createCategory(category)));
    }

    async createCategory(category: Category, trx?: Knex.Transaction) {
        await this.withTransaction(async (trx) => {
            if (category.parent) {
                this.createCategory(category.parent);
            }
            await trx.insert(this.parseCategoryToTable(category)).into(CategoryRepository.TABLE_NAME);
        }, trx);
    }

    async getCategories(): Promise<Array<BaseCategory>> {
        const response = await this.db.select().from(CategoryRepository.TABLE_NAME).where('deleted', false).orderBy('parent_id', 'desc');

        return response.map(this.mapTableToCategory);
    }

    private mapTableToCategory(tableEntry: TableStructure): BaseCategory {
        return new BaseCategory(
            tableEntry.id,
            tableEntry.name,
            tableEntry.parent_id,
            tableEntry.created_at,
            tableEntry.updated_at,
            tableEntry.deleted
        );
    }

    private parseCategoryToTable(category: Category): TableStructure {
        return {
            id: category.id,
            created_at: category.createdAt,
            updated_at: category.updatedAt,
            name: category.name,
            deleted: category.deleted,
            parent_id: category.parent ? category.parent.id : null
        };
    }
}