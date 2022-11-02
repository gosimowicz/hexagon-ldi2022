import { Container } from 'typedi';
import { Get, JsonController } from 'routing-controllers';
import { CategoryService } from '../services/CategoryService';

@JsonController('/category')
export class CategoryController {
    private readonly categoryService: CategoryService;

    constructor() {
        this.categoryService = Container.get(CategoryService);
    }

    @Get('/tree')
    public getCategoriesTree() {
        return this.categoryService.getCategoriesTree();
    }

    @Get('/')
    public getAllCategories() {
        return this.categoryService.getCategories();
    }
}