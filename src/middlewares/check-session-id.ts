import { FastifyReply, FastifyRequest } from 'fastify'

import { knex } from '../../db/config'

export const checkSessionId = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const sessionId = request.cookies.sessionId

  if (!sessionId)
    return reply.status(401).send({
      message: 'Unauthorized',
    })

  const user = await knex('users').where({ session_id: sessionId }).first()

  request.user = user
}
