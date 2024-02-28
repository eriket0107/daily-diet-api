import { app } from './app'
import { env } from './env'
const port = env.PORT || 3333

app.get('/', (request, reply) => {
  return reply.send('OK')
})

app
  .listen({
    port,
  })
  .then((test) => console.log(`${test} Server listening on port ${env.PORT}`))
