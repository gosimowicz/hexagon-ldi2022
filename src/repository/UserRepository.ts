import { Knex } from 'knex';
import { Service, Container } from 'typedi';
import { User } from '../models/User';
import { chunk } from '../utils/arrays';
import { BaseRepository } from './BaseRepository';

@Service()
export class UserRepository extends BaseRepository {
    private static readonly TABLE_NAME = 'users';
    private static readonly USERS_ROLE_TABLE_NAME = 'users_roles';

    async deleteUsers() {
        await this.db.delete().from(UserRepository.TABLE_NAME);
    }

    async createUsers(allUsers: ReadonlyArray<User>) {
        await this.withTransaction(async (trx) => {
            const chunks = chunk(allUsers, 1000);

            for await (const users of chunks) {
                await trx.insert(users.map(this.parseUserToTable)).into(UserRepository.TABLE_NAME);
                await trx.insert(users.reduce((acc, user) => {
                    user.roles.forEach(role => acc.push({
                        user_id: user.id,
                        role_id: role.id
                    }));
                    return acc;
                }, [] as Array<{user_id: string, role_id: string}>)).into(UserRepository.USERS_ROLE_TABLE_NAME);
            }
        });
    }

    private parseUserToTable(user: User) {
        return {
            id: user.id,
            username: user.username,
            firsname: user.firsname,
            lastname: user.lastname,
            email: user.email,
            created_at: user.createdAt,
            updated_at: user.updatedAt,
            deleted: user.deleted
        };
    }
}