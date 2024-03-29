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

      const sessionUser = request.user
      const { mealId } = paramsSchema.parse(request.params)

      if (!mealId) return reply.status(404).send('Unable to use meald ID')

      const mealToUpdate = await knex('meals')
        .select()
        .where({ id: mealId })
        .first()

      if (!mealToUpdate) return reply.status(404).send('Meal not found')

      const { name, description, date, isOnDiet } = updateMealBodySchema.parse(
        request.body,
      )

      await knex('meals')
        .where({ id: mealId, user_id: sessionUser?.id })
        .update({
          name: name || mealToUpdate?.name,
          description: description || mealToUpdate?.description,
          is_on_diet: isOnDiet || mealToUpdate?.is_on_diet,
          date: date?.toUTCString() || mealToUpdate?.date,
          updated_at: new Date().toUTCString(),
        })

      return reply.status(204).send()
    },
  )

  app.delete(
    '/:mealId',
    { preHandler: [checkSessionId] },
    async (request, reply) => {
      const paramsSchema = z.object({
        mealId: z.string(),
      })
      const sessionUser = request.user

      const { mealId } = paramsSchema.parse(request.params)

      if (!mealId) return reply.status(404).send('Unable to use meald ID')

      const mealToDelete = await knex('meals')
        .select()
        .where({ id: mealId })
        .first()

      if (!mealToDelete) return reply.status(404).send('Meal not found')

      await knex('meals')
        .where({ id: mealId, user_id: sessionUser?.id })
        .delete()

      return reply.status(204).send()
    },
  )

  app.get('/list', { preHandler: [checkSessionId] }, async (request, reply) => {
    const sessionUser = request.user

    const listMeals = await knex('meals')
      .select('')
      .where({ user_id: sessionUser?.id })
      .orderBy('date', 'desc')

    return reply.status(200).send({ listMeals })
  })

  app.get(
    '/:mealId',
    { preHandler: [checkSessionId] },
    async (request, reply) => {
      const paramsSchema = z.object({
        mealId: z.string(),
      })

      const sessionUser = request.user

      const { mealId } = paramsSchema.parse(request.params)

      if (!mealId) return reply.status(404).send('Unable to use meald ID')

      const meal = await knex('meals')
        .select()
        .where({ id: mealId, user_id: sessionUser?.id })
        .first()

      return reply.status(200).send({ meal })
    },
  )

  app.get(
    '/metrics',
    { preHandler: [checkSessionId] },
    async (request, reply) => {
      const sessionUser = request.user

      const totalMealsOnDiet = await knex('meals')
        .where({ user_id: sessionUser?.id, is_on_diet: true })
        .count('id', { as: 'total' })
        .first()

      const totalMealsOffDiet = await knex('meals')
        .where({ user_id: sessionUser?.id, is_on_diet: false })
        .count('id', { as: 'total' })
        .first()

      const totalMeals = await knex('meals')
        .where({ user_id: sessionUser?.id })
        .orderBy('created_at', 'desc')

      const { bestDietSequence } = totalMeals.reduce(
        (acc, meal) => {
          if (meal.is_on_diet) {
            acc.currentSequence += 1
          } else {
            acc.currentSequence = 0
          }

          if (acc.currentSequence > acc.bestDietSequence) {
            acc.bestDietSequence = acc.currentSequence
          }

          return acc
        },
        { currentSequence: 0, bestDietSequence: 0 },
      )

      return reply.status(200).send({
        totalMeals: totalMeals.length,
        totalMealsOnDiet: totalMealsOnDiet?.total,
        totalMealsOffDiet: totalMealsOffDiet?.total,
        bestDietSequence,
      })
    },
  )
}
