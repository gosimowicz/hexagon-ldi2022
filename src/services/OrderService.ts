import { OrderRepository } from '../repository/OrderRepository';
import { Service, Container } from 'typedi';
import { CategoryService } from './CategoryService';

@Service()
export class OrderService {
    private readonly categoryService: CategoryService;
    private readonly orderRepository: OrderRepository;

    constructor() {
        this.categoryService = Container.get(CategoryService);
        this.orderRepository = Container.get(OrderRepository);
    }

    async getMostPopularProducts(
        categoryIds: ReadonlyArray<string>,
        count?: number
    ) {
        const categories = await this.categoryService.getCategoriesWithChildrens(categoryIds);

        const response = this.orderRepository.getMostPopularProducts(categories.map(c => c.id), count);

        return response;
    }
}