import { FastifyInstance } from 'fastify'

export const mealsRoutes = async (app: FastifyInstance) => {
  app.post('/', async (request, reply) => {
    return reply.send('Meals OK')
  })
}
