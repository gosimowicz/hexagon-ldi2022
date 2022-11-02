import { faker } from '@faker-js/faker';
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

    async getCategories(): Promise<BaseCategory[]> {
        return await this.categoryRepository.getCategories();
    }

    async getCategoriesWithChildrens(categoryIds: ReadonlyArray<string>): Promise<BaseCategory[]> {
        // console.log('categoryService.getCategoriesWithChildrens');
        const uuid = faker.datatype.uuid();
        // console.time(`getCategoriesWithChildrens - ${uuid}`);
        const categories = await this.getCategories();

        const categoriesById = _.keyBy(categories, cat => cat.id);
        const categoriesByParentId = _.groupBy(categories, c => c.parentId ?? -1);

        if (_.isEmpty(categoryIds)) {
            categoryIds = categoriesByParentId[-1].map(c => c.id);
        }

        const response = _.flatMap(categoryIds, (id) => {
            const category = categoriesById[id];

            if (!category) {
                return [];
            }

            return [
                category,
                ...this.findChildrenByCategoryId(id, categoriesByParentId)
            ];
        });

        return await new Promise((resolve) => setTimeout(() => resolve(response), 1000));
    }

    async getCategoriesTree(): Promise<CategoryTree> {
        const categories = await this.categoryRepository.getCategories();

        const tree = _(categories)
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

        return tree;
    }

    private findChildrenByCategoryId(categoryId: string, categoriesByParentId: {[id: string]: ReadonlyArray<BaseCategory>}): BaseCategory[] {
        return _.flatMap(categoriesByParentId[categoryId], (category) =>
            [category, ...this.findChildrenByCategoryId(category.id, categoriesByParentId)]
        );
    }

}