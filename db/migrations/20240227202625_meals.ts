import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('meal', (table) => {
    table.uuid('id').defaultTo(knex.fn.uuid()).primary()
    table.string('name').notNullable()
    table.string('description').notNullable()
    table.boolean('is_on_diet').notNullable()
    table.timestamps(true, true)
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('meal')
}
