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
}
