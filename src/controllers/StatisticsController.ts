import { Get, JsonController, QueryParam } from 'routing-controllers';
import Container from 'typedi';
import { CategoryService } from '../services/CategoryService';
import { OrderService } from '../services/OrderService';

import { StatisticsService } from '../services/StatisticsService';

@JsonController('/statistics')
export class StatisticsController {
    get statisticsService(): StatisticsService {
        return Container.get(StatisticsService);
    }

    get orderService(): OrderService {
        return Container.get(OrderService);
    }

    get categoryService(): CategoryService {
        return Container.get(CategoryService);
    }

    @Get('/most-popular-products')
    public async getMostPopularProducts(
        @QueryParam('categoryIds', { required: false }) categoryIds: string,
        @QueryParam('count', { type: 'number' }) count?: number
    ) {
        const categories = await this.categoryService.getCategoriesWithChildrens(categoryIds?.split(',') ?? []);
        const ids = categories.map(c => c.id);
        const [mostPopularProducts, prices] = await Promise.all([
            this.orderService.getMostPopularProducts(ids, count),
            this.statisticsService.getPricesStatistics(ids)
        ]);
        // const prices = await this.statisticsService.getPricesStatistics(categoryIds?.split(',') ?? []);

        return {
            mostPopularProducts,
            prices
        };
    }
}