import { execSync } from 'node:child_process'

import request from 'supertest'
import { beforeAll, beforeEach, describe, expect, it } from 'vitest'

import { app } from '../src/app'

describe('Meals routes', async () => {
  beforeAll(async () => {
    await app.ready()
  })

  beforeEach(async () => {
    execSync('pnpm knex migrate:rollback --all')
    execSync('pnpm knex migrate:latest')
  })

  it('should be able to create a meal', async () => {
    const userResponse = await request(app.server)
      .post('/users')
      .send({
        name: 'John Doe',
        email: 'john@doe.com',
      })
      .expect(201)

    const cookies = userResponse.get('Set-Cookie')

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Meal to 5',
        description: '5',
        isOnDiet: false,
        date: new Date().toISOString(),
      })
      .expect(201)
  })

  it('should be able to list all meals', async () => {
    const userResponse = await request(app.server)
      .post('/users')
      .send({
        name: 'John Doe',
        email: 'john@doe.com',
      })
      .expect(201)

    const cookies = userResponse.get('Set-Cookie')

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Meal test 1',
        description: '5',
        isOnDiet: false,
        date: new Date().toISOString(),
      })
      .expect(201)

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Meal test 2',
        description: '5',
        isOnDiet: false,
        date: new Date().toISOString(),
      })
      .expect(201)

    const mealListBody = await request(app.server)
      .get('/meals/list')
      .set('Cookie', cookies)
      .expect(200)

    expect(mealListBody.body.listMeals).toHaveLength(2)
  })

  it('should be able to show a single meal', async () => {
    const userResponse = await request(app.server)
      .post('/users')
      .send({
        name: 'John Doe',
        email: 'john@doe.com',
      })
      .expect(201)

    const cookies = userResponse.get('Set-Cookie')

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Meal test 1',
        description: '5',
        isOnDiet: false,
        date: new Date().toUTCString(),
      })
      .expect(201)

    const mealListBody = await request(app.server)
      .get('/meals/list')
      .set('Cookie', cookies)
      .expect(200)

    const mealId = mealListBody.body.listMeals[0].id

    const mealResponse = await request(app.server)
      .get(`/meals/${mealId}`)
      .set('Cookie', cookies)
      .expect(200)

    console.log(mealResponse.body)
    expect(mealResponse.body).toEqual({
      meal: {
        created_at: expect.any(String),
        date: expect.any(String),
        description: '5',
        id: expect.any(String),
        is_on_diet: 0, // false
        name: 'Meal test 1',
        updated_at: expect.any(String),
        user_id: expect.any(String),
      },
    })
  })

  it('should be able to update a meal from a user', async () => {
    const userResponse = await request(app.server)
      .post('/users')
      .send({
        name: 'John Doe',
        email: 'john@doe.com',
      })
      .expect(201)

    const cookies = userResponse.get('Set-Cookie')
    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Meal test 1',
        description: '5',
        isOnDiet: true,
        date: new Date().toISOString(),
      })
      .expect(201)

    const mealResponse = await request(app.server)
      .get('/meals/list')
      .set('Cookie', cookies)
      .expect(200)

    const mealId = mealResponse.body.listMeals[0].id

    await request(app.server)
      .put(`/meals/${mealId}`)
      .set('Cookie', cookies)
      .send({
        name: 'Meal test 2',
        description: 'Meal changed',
        isOnDiet: true,
        date: new Date().toISOString(),
      })
      .expect(204)
  })

  it('should be able to get metrics from a user', async () => {
    const userResponse = await request(app.server)
      .post('/users')
      .send({ name: 'John Doe', email: 'john@doe.com' })
      .expect(201)

    await request(app.server)
      .post('/meals')
      .set('Cookie', userResponse.get('Set-Cookie'))
      .send({
        name: 'Breakfast',
        description: "It's a breakfast",
        isOnDiet: true,
        date: new Date(),
      })
      .expect(201)

    await request(app.server)
      .post('/meals')
      .set('Cookie', userResponse.get('Set-Cookie'))
      .send({
        name: 'Lunch',
        description: "It's a lunch",
        isOnDiet: false,
        date: new Date(),
      })
      .expect(201)

    await request(app.server)
      .post('/meals')
      .set('Cookie', userResponse.get('Set-Cookie'))
      .send({
        name: 'Snack',
        description: "It's a snack",
        isOnDiet: true,
        date: new Date(),
      })
      .expect(201)

    await request(app.server)
      .post('/meals')
      .set('Cookie', userResponse.get('Set-Cookie'))
      .send({
        name: 'Dinner',
        description: "It's a dinner",
        isOnDiet: true,
        date: new Date(),
      })

    await request(app.server)
      .post('/meals')
      .set('Cookie', userResponse.get('Set-Cookie'))
      .send({
        name: 'Breakfast',
        description: "It's a breakfast",
        isOnDiet: true,
        date: new Date(),
      })

    const metricsResponse = await request(app.server)
      .get('/meals/metrics')
      .set('Cookie', userResponse.get('Set-Cookie'))
      .expect(200)

    expect(metricsResponse.body).toEqual({
      totalMeals: 5,
      totalMealsOnDiet: 4,
      totalMealsOffDiet: 1,
      bestDietSequence: 3,
    })
  })
})
