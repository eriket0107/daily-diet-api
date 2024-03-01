import { execSync } from 'node:child_process'

import request from 'supertest'
import { beforeAll, beforeEach, describe, expect, it } from 'vitest'

import { app } from '../src/app'

describe('Users routes', async () => {
  beforeAll(async () => {
    await app.ready()
  })

  beforeEach(async () => {
    execSync('pnpm knex migrate:rollback --all')
    execSync('pnpm knex migrate:latest')
  })

  it('should create a new user', async () => {
    const response = await request(app.server)
      .post('/users')
      .send({ name: 'Teste', email: 'teste@example.com' })
      .expect(201)

    const cookies = response.get('Set-Cookie')

    expect(cookies).toEqual(
      expect.arrayContaining([expect.stringContaining('sessionId')]),
    )
  })
})
