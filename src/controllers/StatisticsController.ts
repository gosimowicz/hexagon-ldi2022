import { Get, JsonController, QueryParam } from 'routing-controllers';
import Container from 'typedi';
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

    @Get('/most-popular-products')
    public async getMostPopularProducts(
        @QueryParam('categoryIds', { required: false }) categoryIds: string,
        @QueryParam('count', { type: 'number' }) count?: number
    ) {
        const mostPopularProducts = await this.orderService.getMostPopularProducts(categoryIds?.split(',') ?? [], count);
        const prices = await this.statisticsService.getPricesStatistics(categoryIds?.split(',') ?? []);

        return {
            mostPopularProducts,
            prices
        };
    }
}