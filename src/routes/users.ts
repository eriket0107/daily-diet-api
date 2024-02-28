import { randomUUID } from 'node:crypto'

import { FastifyInstance } from 'fastify'
import { z } from 'zod'

import { knex } from '../../db/config'

export const usersRoutes = async (app: FastifyInstance) => {
  app.post('/', async (request, reply) => {
    const createUserSchema = z.object({
      name: z.string(),
      email: z.string().email(),
    })

    let sessionId = request.cookies.sessionId

    if (!sessionId) {
      sessionId = randomUUID()

      reply.setCookie('sessionId', sessionId, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })
    }

    const { email, name } = createUserSchema.parse(request.body)

    const emailAlreadyExists = await knex('users').where({ email }).first()

    if (emailAlreadyExists) {
      return reply.status(401).send({
        message: 'Unauthorized. Email already exists',
      })
    }

    await knex('users').insert({ name, email, session_id: sessionId })

    return reply.status(201).send()
  })
}
