export enum ROLE_TYPE {
    ADMIN = 'admin',
    USER = 'standard',
    PREMIUM_USER = 'premium'
}

export class Role {
    constructor(public readonly id: string, public readonly name: ROLE_TYPE) {}
}