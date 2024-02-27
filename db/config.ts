import { Knex, knex as setupKnex } from 'knex'
import path from 'path'

import { env } from '../src/env'

export const config: Knex.Config = {
  client: 'pg',
  connection: {
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    port: env.DB_PORT,
  },
  migrations: {
    extension: 'ts',
    directory: path.resolve('db', 'migrations'),
    tableName: 'knex_migrations',
  },
}

export const knex = setupKnex(config)
