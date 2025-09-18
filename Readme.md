# Express: User password auth and JWT auth

```js
npm init -y
npm install date-fns, express, uuid
npm install nodemon -D
npm install nodemone -g
npm install cors
npm install bcrypt
```

### **📜[Compact_HTTP_status_code_cheatsheet_for_APIs.md](Compact_HTTP_status_code_cheatsheet_for_APIs.md)**

### ✅ Rule of thumb:

- Use `res.status(...).json(...)` if you want to send structured data.
- Use `res.sendStatus(...)` if you only care about the status (no details).

 <br />

## Create new user:

1. create **model/users.json**: `[]`
2. create **controllers/registerController.js**
3. create **routes/register.js**
4. update **server.js**: import register route
5. test with Thunder client: try to add new user

- POST http://localhost:3500/register
- Body: `{ "user": "Test1", "pwd": "123456" }` remember the password!

## Logg in:

1. create **controllers/authController.js**
2. create **routes/auth.js**
3. update **server.js**: import auth route
4. test with Thunder client: try to logg in

- POST http://localhost:3500/auth
- Body `{ "user": "Test1", "pwd": "123456" }`
