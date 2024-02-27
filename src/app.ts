import cookie from '@fastify/cookie'
import fastify, { FastifyInstance } from 'fastify'

export const app: FastifyInstance = fastify()

app.register(cookie)
