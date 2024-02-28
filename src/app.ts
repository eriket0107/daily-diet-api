import cookie from '@fastify/cookie'
import fastify, { FastifyInstance } from 'fastify'

import { mealsRoutes } from './routes/meals'
import { usersRoutes } from './routes/users'

export const app: FastifyInstance = fastify()

app.register(cookie)
app.register(usersRoutes, { prefix: '/users' })
app.register(mealsRoutes, { prefix: '/meals' })
