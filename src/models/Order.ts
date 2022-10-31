import { BaseUser } from './User';

export class BaseOrder {
    constructor(
        public readonly id: string,
        public readonly userId: string,
        public readonly createAt: Date,
        public readonly updatedAt: Date,
    ){}
}

export class Order extends BaseOrder {
    constructor(
        id: string,
        public readonly user: BaseUser,
        createAt: Date,
        updatedAt: Date,
        public readonly orderedProducts: ReadonlyArray<OrderedProductBase>,
        public readonly payment: PaymentBase | null,
    ){
        super(id, user.id, createAt, updatedAt);
    }
}

export class OrderedProductBase {
    constructor(
        public readonly productId: string,
        public readonly orderId: string,
        public readonly price: number,
        public readonly amount: number,
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
    ){}
}

export class PaymentBase {
    constructor(
        public readonly id: string,
        public readonly orderId: string,
        public readonly status: string,
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
    ) {}
}