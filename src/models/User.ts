import { Role } from './Role';

export class User {
    constructor(
        public readonly id: string,
        public readonly username: string,
        public readonly firsname: string,
        public readonly lastname: string,
        public readonly email: string,
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
        public readonly roles: ReadonlyArray<Role>,
        public readonly deleted: boolean = false
    ) {
    }
}