import { FastifyInstance } from 'fastify'
import { z } from 'zod'

import { knex } from '../../db/config'
import { checkSessionId } from '../middlewares/check-session-id'

export const mealsRoutes = async (app: FastifyInstance) => {
  app.post('/', { preHandler: [checkSessionId] }, async (request, reply) => {
    const createMealSchema = z.object({
      name: z.string(),
      description: z.string(),
      isOnDiet: z.boolean(),
      date: z.coerce.date(),
    })

    const { name, date, description, isOnDiet } = createMealSchema.parse(
      request.body,
    )

    const sessionUser = request.user

    await knex('meals').insert({
      name,
      description,
      date: date.toUTCString(),
      is_on_diet: isOnDiet,
      user_id: sessionUser?.id,
    })

    return reply.status(201).send()
  })
  app.put(
    '/:mealId',
    { preHandler: [checkSessionId] },
    async (request, reply) => {
      const paramsSchema = z.object({ mealId: z.string() })
      const updateMealBodySchema = z.object({
        name: z.string().optional(),
        description: z.string().optional(),
        isOnDiet: z.boolean().optional(),
        date: z.coerce.date().optional(),
      })

      const { mealId } = paramsSchema.parse(request.params)

      if (!mealId) return reply.status(404).send('Unable to use meald ID')

      const meal = await knex('meals').where({ id: mealId }).first()

      if (!meal) return reply.status(404).send('Meal not found')

      const { name, description, date, isOnDiet } = updateMealBodySchema.parse(
        request.body,
      )

      await knex('meals')
        .where({ id: mealId })
        .update({
          name: name || meal?.name,
          description: description || meal?.description,
          is_on_diet: isOnDiet || meal?.is_on_diet,
          date: date?.toUTCString() || meal?.date,
          updated_at: new Date().toUTCString(),
        })

      return reply.status(204).send()
    },
  )
}
