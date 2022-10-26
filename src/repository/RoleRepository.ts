import { BaseRepository } from './BaseRepository';
import { ROLE_TYPE } from './../models/Role';
import { Service } from 'typedi';
import { Role } from '../models/Role';

@Service()
export class RoleRepository extends BaseRepository {
    private static readonly TABLE_NAME = 'roles';

    public getReoleByTypes(types: ROLE_TYPE[]): Promise<Role[]> {
        if (types.length === 0){
            throw new Error('Role types can\'t be empty');
        }

        return this.db.select<Role[]>().from(RoleRepository.TABLE_NAME).whereIn('name', types);
    }
}