# Express: intro + middleware

```js
npm init -y
npm install date-fns, express, uuid
npm install nodemon -D
npm install nodemone -g
```

- Anything that starts with **express.\*()** -> built-in Express middleware;

- **app.use((req, res) => {...})** -> custom middleware;

- **app.get(...)** -> a route handler, not a middleware,  
  but internally Express also handles it through the middleware chain;

```lua
[HTTP Request] ---> Express
      |
      v
+-------------------------------+
| 1. Internal Middleware         |
+-------------------------------+
| app.use(express.urlencoded())  |  ← parses HTML form data
| app.use(express.json())        |  ← parses JSON
| app.use(express.static(...))   |  ← serves static files
+-------------------------------+
      |
      v
+-------------------------------+
| 2. Route Handlers (app.get)   |
+-------------------------------+
| app.get(['/', '/index'])       |  ← index.html
| app.get('/new-page{.:html}')   |  ← new-page.html
| app.get('/old-page{.:html}')   |  ← redirect
| app.get('/404{.:html}')        |  ← manual 404
+-------------------------------+
      |
      v
+-------------------------------+
| 3. Custom 404 Middleware   |
+-------------------------------+
| app.use((req,res)=>{...})      |  ← catches everything else
+-------------------------------+
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
