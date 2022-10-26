import { faker } from '@faker-js/faker';
import { Knex } from 'knex';
import { Role, ROLE_TYPE } from '../src/models/Role';

const createRole = (name: ROLE_TYPE): Role => {
    return new Role(faker.datatype.uuid(), name);
};

const up = async (knex: Knex): Promise<void> => {
    const adminRole = createRole(ROLE_TYPE.ADMIN);
    const userRole = createRole(ROLE_TYPE.USER);
    const premiumUserRole = createRole(ROLE_TYPE.PREMIUM_USER);

    await knex.insert([adminRole, userRole, premiumUserRole]).into('roles');
};

const down = async (knex: Knex): Promise<void> => {
    knex.delete().from('roles');
};

export { down, up };

