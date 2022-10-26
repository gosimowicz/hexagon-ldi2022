Łódzkie Dni Informatyki 2022
============

DB
---
- create migration: `npx knex migrate:make migration_name`
- run migrations: `npx knex migrate:latest`
- rollback migrations `npx knex migrate:rollback`
- run last migration `npx knex migrate:up`
- rollback last migration `npx knex migrate:down`