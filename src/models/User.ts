import { Role } from './Role';

export class BaseUser {
    constructor(
        public readonly id: string,
        public readonly username: string,
        public readonly firsname: string,
        public readonly lastname: string,
        public readonly email: string,
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
        public readonly deleted: boolean = false
    ) {
    }
}

export class User extends BaseUser {
    constructor(
        id: string,
        username: string,
        firsname: string,
        lastname: string,
        email: string,
        createdAt: Date,
        updatedAt: Date,
        public readonly roles: ReadonlyArray<Role>,
        deleted = false
    ) {
        super(
            id,
            username,
            firsname,
            lastname,
            email,
            createdAt,
            updatedAt,
            deleted,
        );
    }
}