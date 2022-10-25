import {Knex, knex} from 'knex';

let db: Knex;

const connectToDataBase = () => {
    console.log(process.env.PG_CONNECTION_STRING);

    db = knex({
        client: 'pg',
        connection: process.env.PG_CONNECTION_STRING,
        searchPath: ['public'],
        pool: {min: 0, max: 7}
    });
}

export { db, connectToDataBase } ;
  