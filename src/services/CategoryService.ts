import _ from 'lodash';
import { CategoryRepository } from './../repository/CategoryRepository';
import Container, { Service } from 'typedi';
import { BaseCategory, CategoryTree, CategoryTreeEntry } from '../models/Category';

@Service()
export class CategoryService {
    private readonly categoryRepository: CategoryRepository;

    constructor() {
        this.categoryRepository = Container.get(CategoryRepository);
    }

    async getCategoriesTree(): Promise<CategoryTree> {
        const categories = await this.categoryRepository.getCategories();

        return _(categories)
            .map<CategoryTreeEntry>((c: BaseCategory) => new CategoryTreeEntry(
                c.id,
                c.name,
                c.parentId,
                c.createdAt,
                c.updatedAt,
                c.deleted
            )).map<CategoryTreeEntry | undefined>((category, index, categoryTreeEntries) => {
                if (!category.parentId) {
                    return category;
                }

                const parent = _.find(categoryTreeEntries, c => c.id === category.parentId);
                parent?.children.push(category);

            })
            .compact()
            .value();
    }

}