import _ from 'lodash';
import { ROLE_TYPE } from './../models/Role';
import { Service } from 'typedi';
import { BaseUser, User } from '../models/User';
import { BaseRepository } from './BaseRepository';

type TableStructure = {
    id: string,
    created_at: Date,
    updated_at: Date,
    username: string,
    firsname: string,
    lastname: string,
    email: string,
    deleted: boolean,
}

@Service()
export class UserRepository extends BaseRepository {
    private static readonly TABLE_NAME = 'users';
    private static readonly USERS_ROLE_TABLE_NAME = 'users_roles';

    async deleteUsers() {
        await this.db.delete().from(UserRepository.TABLE_NAME);
    }

    async createUsers(allUsers: ReadonlyArray<User>) {
        await this.withTransaction(async (trx) => {
            const chunks = _.chunk(allUsers, 1000);

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

    async getUsersByRoles(roles: ReadonlyArray<ROLE_TYPE>, limit?: number): Promise<BaseUser[]> {
        const query = this.db
            .select<TableStructure[]>('u.*')
            .from({ u: UserRepository.TABLE_NAME })
            .where('deleted', false)
            .innerJoin(`${UserRepository.USERS_ROLE_TABLE_NAME} as ur`, 'u.id', '=', 'ur.user_id')
            .innerJoin('roles as r', 'r.id', '=', 'ur.role_id')
            .whereIn('r.name', roles)
            ;

        if (limit) {
            query.limit(limit);
        }


        return (await query).map(this.parseTableToUser);
    }

    async getRandomUser(deleted = false): Promise<BaseUser> {
        const userEntry = await this.db
            .select<TableStructure>()
            .from(UserRepository.TABLE_NAME)
            .where('deleted', deleted)
            .orderByRaw('RANDOM()')
            .limit(1)
            .first();

        if (!userEntry) {
            throw new Error('Can\'t get random user');
        }

        return this.parseTableToUser(userEntry);
    }

    private parseTableToUser(userEntry: TableStructure): BaseUser {
        return new BaseUser(
            userEntry.id,
            userEntry.username,
            userEntry.firsname,
            userEntry.lastname,
            userEntry.email,
            userEntry.created_at,
            userEntry.updated_at,
            userEntry.deleted
        );
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