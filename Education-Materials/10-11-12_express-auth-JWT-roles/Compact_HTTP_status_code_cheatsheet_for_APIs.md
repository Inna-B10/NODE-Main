# HTTP status code cheat sheet for APIs ⚡

### Quick mnemonic 🎯

- 200s = success
- 300s = redirects
- 400s = client did something wrong
- 500s = server did something wrong

### ✅ Success

- **200 OK** – request succeeded, returning data (GET, PUT, DELETE).
- **201 Created** – new resource created (POST).
- **204 No Content** – success but nothing to return (e.g. delete, logout).

### ⚠️ Client Errors (4xx – the client messed up)

- **400 Bad Request** – request is invalid (missing fields, bad JSON, etc.).
- **401 Unauthorized** – not logged in / missing or invalid credentials.
- **403 Forbidden** – logged in, but not allowed to do this action.
- **404 Not Found** – the resource doesn’t exist.
- **409 Conflict** – request conflicts with current state (e.g. username already taken, duplicate entry).
- **422 Unprocessable Entity** – request is well-formed, but semantically wrong (e.g. invalid email format).

### 💥 Server Errors (5xx – the server messed up)

- **500 Internal Server Error** – unexpected crash or unhandled error.
- **502 Bad Gateway** – server acting as proxy got an invalid response.
- **503 Service Unavailable** – server is down or overloaded.
- **504 Gateway Timeout** – server didn’t respond in time.
