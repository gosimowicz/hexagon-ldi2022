import { BaseCategory, Category } from './Category';
import { BaseUser } from './User';
export class BaseProduct {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly createdById: string | null,
        public readonly updatedById: string | null,
        public readonly categoryId: string,
        public readonly price: number,
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
        public readonly deleted = false
    ){
    }
}

export class Product extends BaseProduct {
    constructor(
        id: string,
        name: string,
        public readonly createdBy: BaseUser,
        public readonly updatedBy: BaseUser,
        public readonly category: BaseCategory,
        price: number,
        createdAt: Date,
        updatedAt: Date,
        deleted = false
    ){
        super(
            id,
            name,
            createdBy ? createdBy.id : null,
            updatedBy ? updatedBy.id : null,
            category.id,
            price,
            createdAt,
            updatedAt,
            deleted
        );
    }
}