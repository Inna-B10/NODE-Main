# Express: Security and best practices

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
```

</details>

<br />

<details>
<summary><h2 style="display:inline"><strong>Security - Rate limit and HTTP headers</strong></h2></summary>

### **🔷 Rate limit:**

1. ### Install `npm install express-rate-limit`
2. ### Create **middleware\rateLimiter.js**

```js
import rateLimit from 'express-rate-limit'

export const apiLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 100,
	message: 'Too many requests from this IP, please try again later',
})
```

3. ### Update **server.js**

- after `app.use(logger)` add `app.use('api/', apiLimiter)` + import

---

<br />

### **🔷 Secure HTTP headers:**

1. ### Install `npm install helmet`
2. ### Update **server.js**

- add `app.use(helmet())` + import

<br />
<br />

## **Reference**:

- Each header can be configured
- Helmet sets the following headers by default:

  - `Content-Security-Policy`: A powerful allow-list of what can happen on your page which mitigates many attacks
  - `Cross-Origin-Opener-Policy`: Helps process-isolate your page
  - `Cross-Origin-Resource-Policy`: Blocks others from loading your resources cross-origin
  - `Origin-Agent-Cluster`: Changes process isolation to be origin-based
  - `Referrer-Policy`: Controls the Referer header
  - `Strict-Transport-Security`: Tells browsers to prefer HTTPS
  - `X-Content-Type-Options`: Avoids MIME sniffing
  - `X-DNS-Prefetch-Control`: Controls DNS prefetching
  - `X-Download-Options`: Forces downloads to be saved (Internet Explorer only)
  - `X-Frame-Options`: Legacy header that mitigates clickjacking attacks
  - `X-Permitted-Cross-Domain-Policies`: Controls cross-domain behavior for Adobe products, like Acrobat
  - `X-Powered-By`: Info about the web server. Removed because it could be used in simple attacks
  - `X-XSS-Protection`: Legacy header that tries to mitigate XSS attacks, but makes things worse, so Helmet disables it

- `Cross-Origin-Embedder-Policy`: This header is **not** set by default. It helps control what resources can be loaded cross-origin. See [**MDN's article on this header**](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cross-Origin-Embedder-Policy) for more.

</details>

<br />

<details>
<summary><h2 style="display:inline"><strong>Event logging</strong></h2></summary>

<br />

1.  ### Install dotenv in case you don't have it already
2.  ### Update **middleware/logEvents.js**: add at the end

```js
if (progress.env.NODE_ENV === 'development') {
	console.log(`${req.method} ${req.path}`)
}
next()
```

3. ### Update/Create **.env**: add

```js
NODE_ENV = development
OPENAI_API_KEY = myKey-123abc456def
```

4. ### Create **controllers\apiController.js**

```js
const apiKey = process.env.OPENAI_API_KEY
```

<br />

- Be sure you import variables from **.env** file at app start.
  In **server.js** you need

```js
import dotenv from 'dotenv'
dotenv.config()
```

5. ### Update **middleware/errorHandler.js**
   replace

```js
console.error(err.stack)
res.status(500).send(err.message)
```

with

```js
if (process.env.NODE_ENV === 'development') {
	console.error(err.stack)
	res.status(500).send(err.message)
} else {
	res.status(500).send('Internal Server Error')
}
```

6. ### Update **server.js**:
   replace

```js
//rate limiting
app.use('api/', apiLimiter)

//helmet
app.use(helmet())
```

with

```js
if (process.env.NODE_ENV === 'development') {
	//rate limiting
	app.use('api/', apiLimiter)

	//helmet
	app.use(helmet())
}
```

</details>
