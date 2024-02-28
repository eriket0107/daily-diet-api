import cookie from '@fastify/cookie'
import fastify, { FastifyInstance } from 'fastify'

import { userRoutes } from './routes/users'

export const app: FastifyInstance = fastify()

app.register(cookie)
app.register(userRoutes, { prefix: '/users' })
