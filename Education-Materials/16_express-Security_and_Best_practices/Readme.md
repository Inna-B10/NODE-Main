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
