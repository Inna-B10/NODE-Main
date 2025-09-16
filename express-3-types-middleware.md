# Express Middleware Cheatsheet

## 🟢 Built-in Middleware (Express 4.16+)

> Already included in Express, no need to install.

**express.json()** → Parse incoming JSON.

```js
app.use(express.json())
```

**express.urlencoded({ extended: true })** → Parse URL-encoded data.

```js
app.use(express.urlencoded({ extended: true }))
```

**express.static("public")** → Serve static files (CSS, JS, images).

```js
app.use(express.static('public'))
```

<br />

## 🟡 Custom Middleware

> Functions you define yourself to handle requests/responses.

Structure:

```js
function logger(req, res, next) {
	console.log(`${req.method} ${req.url}`)
	next() // pass control to next middleware
}

app.use(logger)
```

Notes:

- Always call `next()` unless you want to **end the response**.
- Perfect for logging, authentication checks, request validation, etc.
  <br />

## 🔵 Third-Party Middleware

> Installed via npm, adds extra functionality.

**morgan** → Logging

```js
import morgan from 'morgan'
app.use(morgan('dev'))
```

**cors** → Enable CORS

```js
import cors from 'cors'
app.use(cors())
```

**cookie-parser** → Parse cookies

```js
import cookieParser from 'cookie-parser'
app.use(cookieParser())
```

<br />

## ⚡ Quick Tips

- Middleware order **matters** → runs top to bottom.
- You can mount middleware only on specific routes:
  ```js
  app.use('/api', myMiddleware)
  ```
- Error-handling middleware has **4 args**:
  ```js
  app.use((err, req, res, next) => {
  	console.error(err.stack)
  	res.status(500).send('Something broke!')
  })
  ```
