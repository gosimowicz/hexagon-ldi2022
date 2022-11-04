import { Service, Container } from 'typedi';
import { CategoryService } from './CategoryService';
import { StatisticsRepository } from '../repository/StatisticsRepository';

@Service()
export class StatisticsService {
    private readonly categoryService: CategoryService;
    private readonly statisticsRepository: StatisticsRepository;

    constructor() {
        this.categoryService = Container.get(CategoryService);
        this.statisticsRepository = Container.get(StatisticsRepository);
    }

    async getPricesStatistics(categoryIds: ReadonlyArray<string>) {
        // const categories = await this.categoryService.getCategoriesWithChildrens(categoryIds);

        const response = this.statisticsRepository.getPricesStatistics(categoryIds);

        return response;
    }
}