import { Knex } from 'knex';
import { Container } from 'typedi';

export abstract class BaseRepository {
    protected readonly db: Knex;

    constructor() {
        this.db = Container.get<Knex>('db');
    }

    protected async withTransaction<T>(callback: (trx: Knex.Transaction) => Promise<T> | void, trx?: Knex.Transaction) {
        if (trx) {
            return await callback(trx);
        }

        return await this.db.transaction(callback);
    }
}