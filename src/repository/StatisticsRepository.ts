import { Service } from 'typedi';
import { BaseRepository } from './BaseRepository';

@Service()
export class StatisticsRepository extends BaseRepository {
    async getPricesStatistics(categoryIds: string[]) {
        // console.log('StatisticsRepository.getPricesStatistics');
        const result = await this.db
            .select<{ avgPrice: number, minPrice: number, maxPrice: number, categoryIds: string}[]>('product_id as productId')
            .avg('o.price as avgPrice')
            .min('o.price as minPrice')
            .max('o.price as maxPrice')
            .select('p.price as currentPrice')
            .from('ordered_products as o')
            .join('products as p', 'p.id', 'o.product_id')
            .whereIn('p.category_id', categoryIds)
            .groupBy('o.product_id')
            .groupBy('p.price');

        return await new Promise((resolve) => setTimeout(() => resolve(result), 1000));
    }
}