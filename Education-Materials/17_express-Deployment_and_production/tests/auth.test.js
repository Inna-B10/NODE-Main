import request from 'supertest'
import { app } from '../server.js'

describe('POST /auth', () => {
	it('should return 400 when no credentials are provided', async () => {
		const res = await request(app).post('/auth').send({})
		expect(res.statusCode).toBe(400)
	})

	it('should return 401 when wrong credentials are provided', async () => {
		const res = await request(app).post('/auth').send({ user: 'User', pwd: '123456' })
		expect(res.statusCode).toBe(401)
	})

	it('should return 200 when valid credentials are provided', async () => {
		const res = await request(app).post('/auth').send({ user: 'Test1', pwd: '123456' })
		expect(res.statusCode).toBe(200)
		expect(res.body).toHaveProperty('accessToken') // for example
	})
})
