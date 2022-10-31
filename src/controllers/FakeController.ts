import { BaseProduct, Product } from './../models/Product';
import { CategoryRepository } from './../repository/CategoryRepository';
import { RoleRepository } from './../repository/RoleRepository';
import { faker } from '@faker-js/faker';
import { Body, JsonController, Delete, HttpCode, Post, BadRequestError } from 'routing-controllers';
import { UserRepository } from '../repository/UserRepository';
import { Container } from 'typedi';
import { User } from '../models/User';
import { Role, ROLE_TYPE } from '../models/Role';
import { Category } from '../models/Category';
import loops from '../utils/loops';
import { ProductRepository } from '../repository/ProductRepository';

class GenerateUsersDTO {
    public count!: number;
    public roles!: ROLE_TYPE[];
}

class GenerateCategoriesDTO {
    public count!: number;
    public depth!: number;
}

class GenerateProductsDTO {
    public productsPerUser!: number;
}

@JsonController('/fake')
export class FakeController {
    private readonly userRepository: UserRepository;
    private readonly roleRepository: RoleRepository;
    private readonly categoryRepository: CategoryRepository;
    private readonly productRepository: ProductRepository;

    constructor() {
        this.userRepository = Container.get(UserRepository);
        this.roleRepository = Container.get(RoleRepository);
        this.categoryRepository = Container.get(CategoryRepository);
        this.productRepository = Container.get(ProductRepository);
    }

    @Post('/user')
    public async generateUsers(@Body() params: GenerateUsersDTO){
        const roles = await this.roleRepository.getReoleByTypes(params.roles);

        if (roles.length === 0 || roles.length !== params.roles.length){
            throw new BadRequestError('Can\'t find provided roles');
        }

        await this.userRepository.createUsers(
            loops.mapN(params.count, () => this.generateUser(roles))
        );

        return { added: params.count };
    }

    @Post('/category')
    public async generateCategories(@Body() params: GenerateCategoriesDTO) {
        await this.categoryRepository.createCategories(loops.mapN(params.count, () => this.generateCategory(params.depth)));

        return { added: params.count * params.depth };
    }

    @Delete('/user')
    @HttpCode(204)
    public async deleteUsers() {
        await this.userRepository.deleteUsers();

        return null;
    }

    @Post('/product')
    public async generateProducts(@Body() params: GenerateProductsDTO) {
        const [users, categories] = await Promise.all([
            this.userRepository.getUsersByRoles([ROLE_TYPE.ADMIN]),
            this.categoryRepository.getCategories()
        ]);

        const products: BaseProduct[] = [];
        users.forEach((user) => loops.mapN(params.productsPerUser, () =>
            products.push(new Product(
                faker.datatype.uuid(),
                faker.random.word(),
                user,
                user,
                categories[Math.floor(Math.random() * categories.length)],
                faker.date.past(10),
                faker.date.past(9)
            ))
        ));

        await this.productRepository.createProducts(products);

        return { added: users.length * params.productsPerUser };
    }

    private generateUser(roles: ReadonlyArray<Role>) {
        return new User(
            faker.datatype.uuid(),
            faker.internet.userName(),
            faker.name.firstName(),
            faker.name.lastName(),
            faker.internet.email(),
            faker.date.past(10),
            faker.date.past(9),
            roles
        );
    }

    private generateCategory(depth: number): Category {
        return new Category(
            faker.datatype.uuid(),
            faker.commerce.department(),
            depth > 0 ? this.generateCategory(depth - 1) : null,
            faker.date.past(10),
            faker.date.past(9),
            false
        );
    }
}