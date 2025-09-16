- **app.use(logger)** ---> (middleware)
- **app.get('/about')** ---> (router only for GET /about)
- **app.post('/api')** ---> (router only for POST /api)
- **app.all('\*')** ---> (router: all methods, all paths)
- **app.use((req,res)=>...)** ---> (middleware fallback, if nothing worked at all)

### **Code analysis**

what does code:

```js
app.all(/.*/, (req, res) => {
	res.status(404)
	if (req.accepts('html')) {
		res.sendFile(path.join(__dirname, 'view', '404.html'))
	} else if (req.accepts('json')) {
		res.json({ error: '404, JSON not found' })
	} else if (req.accepts('txt')) {
		res.type('txt').send('404, text not found')
	}
})
```

- `app.all("*")` catches **all** methods on **any** paths.

- `req.accepts()` checks what the client wants in the `Accept` headers: HTML, JSON or plain text.

- Based on this, it returns a different 404 format.

### 💡 Cons:

1. **All requests go through one route**

   - Any routes, static files, APIs — everything will end up here if no match is found earlier.

   - Sometimes this is convenient for small projects, but in large ones it may not be obvious.

2. **No `next()`**

   - In Express, it is a good practice to separate **middleware** and **routes** to easily add new handlers.

   - In such code, adding a new API 404 or HTML 404 separately becomes more difficult.
     <br />
     <br />

# 📌 Difference:

`app.all('\*')` → this is a **router**, it "finally" catches everything if there are no other routes.

`app.use(...)` → this is a **middleware** fallback. Usually put last if you want to catch "everything that's left".

### **Example and tests:**

```js
import express from 'express'
const app = express()

// Middleware-logger
app.use((req, res, next) => {
	console.log('🔹 Middleware:', req.method, req.path)
	next()
})

// Route for /about
app.get('/about', (req, res) => {
	res.send('About page')
})

// Universal route — catches everything (app.all)
app.all('*', (req, res, next) => {
	console.log("🚨 app.all('*') worked!")
	res.status(404).send('Not found by app.all')
})

// Last middleware — fallback
app.use((req, res) => {
	console.log('🛑 app.use worked!')
	res.status(404).send('Not found by app.use')
})

app.listen(3500, () => console.log('Server running...'))
```

### **Tests:**

**1. GET /about**

```
🔹 Middleware: GET /about
(res) "About page"
```

👉 It doesn't even reach **app.all** because the correct root was found.

**2. GET /hello**

```
🔹 Middleware: GET /hello
🚨 app.all('*') worked!
(res) 404 "Not found by app.all"
```

👉 First middleware, then **app.all('\*')**. Response from **app.all**

**3. POST /random**

```
🔹 Middleware: POST /random
🚨 app.all('*') worked!
(res) 404 "Not found by app.all"
```

👉 Works the same way, **app.all** catches any method.
Сохранить перевод

**4. If comment out app.all**

```
🔹 Middleware: GET /hello
🛑 app.use worked!
(res) 404 "Not found by app.use"
```

👉 Now the fallback has entered through middleware.

<br />

## **Smart 404 handler:**

- regular browser requests (HTML) → return a nice 404.html page

- API requests (for example, to /api/...) → return JSON { error: "Not found" }

```js
import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

// Example of routes
app.get('/', (req, res) => {
	res.send('Home page')
})

app.get('/api/data', (req, res) => {
	res.json({ msg: 'Hello API' })
})

// Universal router for all non-existent routes
app.all('*', (req, res, next) => {
	// If the path starts with /api → we will return JSON
	if (req.path.startsWith('/api')) {
		console.log('🚨 API request not found:', req.path)
		return res.status(404).json({ error: 'API endpoint not found' })
	}

	// otherwise we pass it on
	next()
})

// The last middleware for regular pages
app.use((req, res) => {
	console.log('🛑 Page not found:', req.path)
	res.status(404).sendFile(path.join(__dirname, 'view', '404.html'))
})

app.listen(3500, () => console.log('Server running on port 3500...'))
```

### How it works:

- `GET /` → returns **Home page**

- `GET /api/data` → **{ msg: "Hello API" }**

- `GET /api/users` (non-existent) → **{"error":"API endpoint not found"}**

- `GET /hello` (non-existent page) → renders **404.html**

### Visualizing Request Flow in Express with API and Page Separation

```
[HTTP Request]
      |
      v
+-----------------------------+
| 1. Middleware / Parsers     |
| (express.json, urlencoded)  |
+-----------------------------+
      |
      v
+----------------------------+
| 2. Route Handlers          |
| (app.get, app.post...)     |
+----------------------------+
      |
      v
+------------------------------------+
| 3. API 404 (app.all('*'))          |
| - если req.path.startsWith('/api') |
| - returns JSON {error: "..."}      |
+------------------------------------+
      |
      v
+----------------------------+
| 4. HTML 404 (app.use(...)) |
| - regular pages            |
| - returns 404.html         |
+----------------------------+
      |
      v
[Response to Client]
```

### 🔹 Example of behavior:

```
+---------------------------------------------------------+
| URL               | Result                              |
|---------------------------------------------------------|
| /                 | Home page                           |
| /about            | About page                          |
| /api/data         | JSON response { msg: "Hello API" }  |
| /api/users        | JSON 404 { error: "API not found" } |
| /nonexistent-page |  HTML 404 page                      |
+---------------------------------------------------------+
```

### 💡 **Conclusion**

`app.all("*")` → for **API** 404. Catches any methods on any API paths.

`app.use(...)` → for "human" **HTML** pages. Catches everything else for browser pages.
