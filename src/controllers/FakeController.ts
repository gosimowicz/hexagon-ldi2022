import { OrderRepository } from './../repository/OrderRepository';
import { BaseOrder, Order, PaymentBase } from './../models/Order';
import _ from 'lodash';
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
import { OrderedProductBase } from '../models/Order';

type GenerateUsersDTO = {
    count: number;
    roles: ROLE_TYPE[];
}

type GenerateCategoriesDTO = {
    count: number;
    depth: number;
}

type GenerateProductsDTO = {
    productsPerUser: number;
}

type GenerateOrdersDTO = {
    maxNumberOfProducts: number;
    maxNumberOfOrders: number;
}

@JsonController('/fake')
export class FakeController {
    private readonly userRepository: UserRepository;
    private readonly roleRepository: RoleRepository;
    private readonly categoryRepository: CategoryRepository;
    private readonly productRepository: ProductRepository;
    private readonly orderRepository: OrderRepository;

    constructor() {
        this.userRepository = Container.get(UserRepository);
        this.roleRepository = Container.get(RoleRepository);
        this.categoryRepository = Container.get(CategoryRepository);
        this.productRepository = Container.get(ProductRepository);
        this.orderRepository = Container.get(OrderRepository);
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
                parseFloat(_.random(0, 1000, true).toFixed(2)),
                faker.date.past(10),
                faker.date.past(9)
            ))
        ));

        await this.productRepository.createProducts(products);

        return { added: users.length * params.productsPerUser };
    }

    @Post('/order')
    public async generateOrders(@Body() params: GenerateOrdersDTO) {
        let addedProducts = 0;
        const orders: Order[] = [];
        const [products, users] = await Promise.all([
            this.productRepository.getAllProducts(),
            this.userRepository.getUsersByRoles([ROLE_TYPE.USER])
        ]);

        users.forEach((user) => {
            const numberOfOrders = _.random(1, params.maxNumberOfOrders);

            loops.mapN(numberOfOrders, () => {
                const orderId = faker.datatype.uuid();
                const orderCreationDate = faker.date.past(9);
                const numberOfProducts = _.random(1, params.maxNumberOfProducts);
                const startIndexOfProducts = _.random(0, products.length - numberOfProducts);
                const orderedProducts = products.slice(startIndexOfProducts, startIndexOfProducts + numberOfProducts).map((p => new OrderedProductBase(
                    p.id,
                    orderId,
                    Math.random() > 0.5 ? p.price : parseFloat(_.random(0.01, p.price, true).toFixed(2)),
                    _.random(0, 10),
                    orderCreationDate,
                    orderCreationDate
                )));
                addedProducts += orderedProducts.length;

                const payment = Math.random() > 0.5 ? null : new PaymentBase(
                    faker.datatype.uuid(),
                    orderId,
                    'payed',
                    faker.date.soon(1, orderCreationDate),
                    faker.date.soon(1, orderCreationDate)
                );
                orders.push(new Order(orderId, user, orderCreationDate, orderCreationDate, orderedProducts, payment));
            });
        });

        await this.orderRepository.createOrders(orders);

        return { addedProducts, addedOrderes: orders.length };
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