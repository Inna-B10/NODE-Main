# Express: intro + middleware

```js
npm init -y
npm install date-fns, express, uuid
npm install nodemon -D
npm install nodemone -g
npm install cors
```

- Anything that starts with **express.\*()** -> built-in Express middleware;

- **app.use((req, res) => {...})** -> custom middleware;

- **app.get(...)** -> a route handler, not a middleware,  
  but internally Express also handles it through the middleware chain;

```
[HTTP Request] ---> Express
      |
      v
+--------------------------------+
| 1. Internal Middleware         |
+--------------------------------+
| app.use(express.urlencoded())  |  ← parses HTML form data
| app.use(express.json())        |  ← parses JSON
| app.use(express.static(...))   |  ← serves static files
+--------------------------------+
      |
      v
+--------------------------------+
| 2. Route Handlers (app.get)    |
+--------------------------------+
| app.get(['/', '/index'])       |  ← index.html
| app.get('/new-page{.:html}')   |  ← new-page.html
| app.get('/old-page{.:html}')   |  ← redirect
| app.get('/404{.:html}')        |  ← manual 404
+--------------------------------+
      |
      v
+--------------------------------+
| 3. Custom 404 Middleware       |
+--------------------------------+
| app.use((req,res)=>{...})      |  ← catches everything else
+--------------------------------+
      |
      v
[Response sent to client]
```

### ⚡ How it works in practice

1. The request enters Express.

2. Built-in middleware runs first:

   - Parses req.body (JSON or form data)

   - Serves static files from /public/...

3. If the path matches an app.get → the corresponding route handler is executed.

4. If no route matched → the custom 404 middleware (app.use) is called.

5. Response is sent back to the client.

### 💡 Key Points

- Order matters: middleware first, then route handlers, then 404.

- Built-in middleware runs for all routes unless the chain is stopped (`res.send` / `res.end`).

- Route handlers only run if path and HTTP method match.

- The custom 404 middleware catches everything not handled above.

---

### **custom middleware in Express**

```js
app.use((req, res, next) => {
	console.log(req.method, req.path)
	next()
})
```

### 🔹 What it does?

1. `app.use(...)` → middleware that runs for **all routes** and **all HTTP methods**.

2. `(req, res, next)` → standard middleware signature:

   - req → request object

   - res → response object

   - next → function to pass control to the **next middleware or route handler**

3. `console.log(req.method, req.path)` → prints the HTTP method and path for every incoming request.

4. `next()` → **important!** Without it, the request _stops here_ and never reaches the route handlers or other middleware.

```
[HTTP Request] ---> Middleware Logging ---> Built-in Middleware ---> Route Handler ---> Response
```

💡 If you remove `next()`, the request **will hang** — Express thinks the middleware is still working.

### **Read more about middleware in [express-3-types-middleware.md](express-3-types-middleware.md)**

### **See recommended order of middlewares, routes and handles here: [recommended-middlewares-order.md](recommended-middlewares-order.md)**

<br />

# CORS

### 🔹 What is `origin` ?

In the context of **CORS** (Cross-Origin Resource Sharing) - this is the **source of the request**, which consists of:

```
<protocol>://<host>:<port>
```

Examples of `origin`:

- http://localhost:3000

- https://example.com

- http://127.0.0.1:5500

When the browser sends an AJAX-request (via `fetch`, `axios`, etc.), it attaches to the headers:

```
Origin: http://localhost:3000
```

And the server can decide whether to allow or deny this origin.

### 🔹 What means condition:

```js
if (whitelist.indexOf(origin) !== -1 || !origin) //use !origin only in development mode
```

- `whitelist.indexOf(origin) !== -1` → check if this origin is in the list of allowed ones.

- `|| !origin` → skip the request if it **does not have an `Origin` header at all**.

Why?

- Requests like **curl, Postman, or direct access via a browser** (`http://localhost:3500/page`) may not have an `Origin`.

- The browser sends `Origin` **only for cross-domain requests** (for example, when the `frontend` is on `http://localhost:3000`, and the API is on `http://localhost:3500`).

- To prevent such "local" or "server" requests from being blocked, add `|| !origin`

### 🔹 How to test `origin`

1. Start your server
2. From an external website (e.g. https://www.google.com
   ), open the browser console and run: `fetch("http://localhost:3500")`  
   In the server terminal, you should see the request blocked by CORS:

```
origin:  https://www.google.com
GET /
Error: Blocked by CORS!
```

3. Add https://www.google.com
   to your **whitelist** and try the fetch again.  
   This time the request will be allowed, and you’ll see in the terminal:

```
GET /
origin:  https://www.google.com
OPTIONS /
```
