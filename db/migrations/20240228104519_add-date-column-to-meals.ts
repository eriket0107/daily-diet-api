import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('meals', (table) => {
    table.timestamp('date').notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('meals', (table) => {
    table.dropColumn('date')
  })
}
