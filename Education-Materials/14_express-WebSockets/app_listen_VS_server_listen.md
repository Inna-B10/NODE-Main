# Express Server: `app.listen(...)` vs `server.listen(...)`

### <strong>**1. `app.listen(...)`** creates its own HTTP server and starts it</strong>

- Use case: simple projects, REST APIs, static pages.

- Limitations: cannot attach WebSockets or configure HTTPS directly.

```js
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
```

it's short form of

```js
const http = require('http')
const server = http.createServer(app)
server.listen(PORT, () => console.log(`Server running on port ${PORT}`))
```

<br />
<br />

### <strong>**2. `server.listen(...)`**</strong>

Use `const server = http.createServer(app)`
and `server.listen(...)` when you need **one server** for:

1. Regular **website** pages

   - GET /, GET /about.html, app.use(express.static(...)) etc.

2. **API**

   - GET /api/..., POST /api/..., any Express routes.

3. Chat via **Socket.IO**

   - const io = new Server(server)
   - WebSocket connections use the same server, and messages can be sent in real time.

```pgsql

           ┌───────────────┐
Browser → │ HTTP Request  │ → Express → pages/API
           └───────────────┘
           │
           │ WebSocket
           ▼
        Socket.IO → Real-time chat
```

<br />

### <strong>🚩 Important:</strong>

Calling both `app.listen(...)` and `server.listen(...)` will create **two separate** servers, and Socket.IO will attach only to the one passed to `new Server(server)`.

<br />

### <strong>**3. Comparison Table**</strong>

| Feature / Use Case              | `app.listen()`                       | `http.createServer(app) + server.listen()`      |
| ------------------------------- | ------------------------------------ | ----------------------------------------------- |
| Basic HTTP server               | ✅ Yes                               | ✅ Yes                                          |
| Access to the underlying server | ❌ No                                | ✅ Yes                                          |
| WebSockets / Socket.IO          | ❌ Not supported                     | ✅ Fully supported                              |
| HTTPS / custom server config    | ❌ Not possible                      | ✅ Fully supported                              |
| Clustering / advanced Node      | ❌ Limited                           | ✅ Fully flexible                               |
| Simplicity                      | ✅ Very simple, less code            | ⚠️ More code, but flexible                      |
| When to use                     | Small REST APIs, static pages, demos | Real-time apps, chat, combined HTTP + WebSocket |

<br />

## 🔹 4. Summary

- **`app.listen()`** → shortcut for simple projects, small APIs, static pages.
- **`http.createServer(app)` + `server.listen()`** → flexible, gives full control, required for WebSockets, HTTPS, clustering.

> If using `http.createServer(app)` → use `server.listen(PORT, ...)` only.  
> **Don't use app.listen(...) simultaneously.**

<br />

> **Tip:** For Socket.IO or any real-time features, always use `http.createServer(app)` and attach Socket.IO to that server.
