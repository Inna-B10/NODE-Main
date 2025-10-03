# Express: Deployment and production ready server

<details>
<summary>used libraries:</summary>

```js
npm init -y
npm install date-fns, express, uuid
npm install nodemon -D
npm install nodemon -g
npm install cors
npm install better-sqlite3
npm install express-rate-limit
npm install helmet
npm install dotenv
npm install -g pm2
npm install --save-dev jest supertest
npm install bcrypt
npm install jsonwebtoken
```

</details>

<br />

<details>
<summary><h2 style="display:inline"><strong>Docker</strong></h2></summary>

1. ### Create **Docker** file
   - With Capital letter D
   - Without extension
   - In the root of the project

```js
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3500
CMD ["node", "server.js"]
```

2. ### Create **docker-compose.yml**

```js
version: '3.9'
services:
  server:
    build: .
    ports:
      - '3500:3500'
    environment:
      - NODE_ENV = production
      - ACCESS_TOKEN_SECRET=${ACCESS_TOKEN_SECRET}
      - REFRESH_TOKEN_SECRET=${REFRESH_TOKEN_SECRET}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
```

</details>

<br />

<details>
<summary><h2 style="display:inline"><strong>PM2</strong></h2></summary>

<br />

1. ### Install PM2

2. ### In terminal run:

   `pm2 start server.js -- --name=server`

3. ### To stop server run:

   `pm2 stop server`

4. ### Update **Docker**

```js
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3500
CMD ["pm2-runtime", "server.js"]
```

</details>

<br />

<details>
<summary><h2 style="display:inline"><strong>Testing</strong></h2></summary>

<br />

1. ### Install Jest and Supertest

2. ### Update **package.json**

```json
	"scripts": {
		"start": "node server",
		"dev": "nodemon server",
		"test": "jest"
	},
```

- **🚩 on Windows with ES Modules** for testing with Jest - use

```json
	"scripts": {
		"start": "node server",
		"dev": "nodemon server",
		"test": "set NODE_OPTIONS=--experimental-vm-modules && jest"
	},
```

3. ### We need old files from lesson **10-11-12_express-auth-JWT-roles**

- `controllers\authController.js`
- `routes\auth.js`
- `model\users.json`
- install `jsonwebtoken` and `bcrypt` if necessary

4. ### Update **server.js**

- add

```js
import { authRouter } from '#routes/auth.js'
app.use('/auth{/}', authRouter)
```

- replace `const app = express()` with `export const app = express()`

5. ### Create **tests/auth.test.js**

```js
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
```

6. ### In terminal run: `npm test`

<br />

<details>
<summary><h2 style="display:inline"><strong>📝 Explanation of the /auth tests</strong></h2></summary>

<br />

We created a test suite for the `POST /auth` endpoint using **Jest** and **supertest**.  
The goal was to verify how the authentication route responds under different input scenarios.

1. **No credentials provided**

```js
it('should return 400 when no credentials are provided', async () => {
	const res = await request(app).post('/auth').send({})
	expect(res.statusCode).toBe(400)
})
```

- **Expected result:** `400 Bad Request`
- **Reasoning:** The request body is empty, so the required fields are missing. The server correctly rejects the request as malformed.

2. **Invalid credentials provided**

```js
it('should return 401 when wrong credentials are provided', async () => {
	const res = await request(app).post('/auth').send({ user: 'User', pwd: '123456' })
	expect(res.statusCode).toBe(401)
})
```

- **Expected result:** `401 Unauthorized`
- **Reasoning:** The request contains a username and password, but they do not match any existing user. The server correctly denies authentication.

3. **Valid credentials provided**

```js
it('should return 200 when valid credentials are provided', async () => {
	const res = await request(app).post('/auth').send({ user: 'Test1', pwd: '123456' })
	expect(res.statusCode).toBe(200)
	expect(res.body).toHaveProperty('accessToken')
})
```

- **Expected result:** `200 OK`
- **Reasoning:** The request contains valid user credentials. The server successfully authenticates the user and returns an access token.

---

<br />
✅ All tests passed successfully, confirming that the authentication endpoint behaves correctly for **missing data**, **invalid data**, and **valid data**.
</details>
<br />

### 💡 OPTIONAL: For big projects useful to create **jest.config.js**

```js
export default {
	// Use the Node environment instead of jsdom (the browser default)
	testEnvironment: 'node',

	// Disable transformation (babel/jest) so ESM files are read directly
	transform: {},

	// Optional: specify the test folder
	testMatch: ['**/tests/**/*.test.js'],

	// You can explicitly specify an extension for the module system
	moduleFileExtensions: ['js', 'mjs', 'json'],

	// For readable output
	verbose: true,
}
```

### 🔹 What does each setting do?

- `testEnvironment: 'node'` → tests run in Node, not in the browser environment (jsdom).

- `transform: {}` → disables babel/jest transformation so ESM files can be imported directly using `import`.

- `testMatch` → explicitly searches for tests only in the `tests` folder.

- `moduleFileExtensions` → adds support for `.mjs` and `.js`.

- `verbose: true` → nice, verbose console output when running tests.
</details>
