# Express: User password auth and JWT auth

<details>
<summary>used libraries:</summary>

```js
npm init -y
npm install date-fns, express, uuid
npm install nodemon -D
npm install nodemone -g
npm install cors
npm install bcrypt
npm install dotenv
npm install jsonwebtoken
npm install cookie-parser
```

</details>

### **👉 [Compact_HTTP_status_code_cheatsheet_for_APIs.md](Compact_HTTP_status_code_cheatsheet_for_APIs.md)**

### 💡 Rule of thumb:

- Use `res.status(...).json(...)` if you want to send structured data.
- Use `res.sendStatus(...)` if you only care about the status (no details).

 <br />
<details>

<summary><h3 style="display:inline"><strong>Step 1 - Create a new user</strong></h3></summary>
<br />

1. Create **model/users.json**: `[]`
2. Create **controllers/registerController.js** (see file)
3. Create **routes/register.js** (see file)
4. Update **server.js**: import _**register route**_
5. Test with **Thunder client**: try to add new user

   - POST http://localhost:3500/register
   - Body: `{ "user": "Test1", "pwd": "123456" }` remember the password!
   </details>
   <br />

<details>
<summary><h3 style="display:inline"><strong>Step 2 - Log in</strong></h3></summary>
<br />

1. create **controllers/authController.js**:

```js
import { rootDir } from '#utils/path.js'
import bcrypt from 'bcrypt'
import fs from 'fs'
import path from 'path'

const usersDataPath = path.join(rootDir, 'model', 'users.json')
export const usersDB = {
	users: JSON.parse(fs.readFileSync(usersDataPath, 'utf-8')),
	setUsers(data) {
		this.users = data
	},
}

export const handleLogin = async (req, res) => {
	const { user, pwd } = req.body
	if (!user || !pwd) return res.status(400).json({ message: 'Username and password are required!' })

	const foundUser = usersDB.users.find(person => person.username === user)
	if (!foundUser) return res.sendStatus(401)

	const match = await bcrypt.compare(pwd, foundUser.password)
	if (match) {
		res.json({ message: `User ${user} logged in` })
	} else {
		res.sendStatus(401)
	}
}
```

2. Create **routes/auth.js** (see file)
3. Update **server.js**: import _**auth route**_
4. Test with **Thunder client**: try to log in

   - POST http://localhost:3500/auth
   - Body `{ "user": "Test1", "pwd": "123456" }`

5. Check **users.json** file: new user should be added.
</details>
<br />
<details>
<summary><h3 style="display:inline"><strong>Step 3 - JWT auth</strong></h3></summary>

### 👉 about **[JWT\_(JSON_Web_Token).md](<JWT_(JSON_Web_Token).md>)**

1. create **.env** file:

```
ACCESS_TOKEN_SECRET =
REFRESH_TOKEN_SECRET =
```

2. Terminal (stop server if it's running):
   - Run: `node`
   - Run this command to generate a random 64-byte hex string: `require("crypto").randomBytes(64).toString("hex")`
   - Copy the output and paste it as the value of `ACCESS_TOKEN_SECRET` in your **.env** file.
   - Run the same command again to generate a new string.
   - Copy that output and paste it as the value of `REFRESH_TOKEN_SECRET` in your **.env** file
3. 🚩 **add .env to .gitignore file!**
4. Create **middleware/verifyJWT.js** (see file)
5. Update **authController.js**:

```js
import dotenv from 'dotenv'
dotenv.config()

import { rootDir } from '#utils/path.js'
import bcrypt from 'bcrypt'
import fs from 'fs'
import * as fsPromises from 'fs/promises'
import jwt from 'jsonwebtoken'
import path from 'path'

const usersDataPath = path.join(rootDir, 'model', 'users.json')

export const usersDB = {
	users: JSON.parse(fs.readFileSync(usersDataPath, 'utf-8')),
	setUsers(data) {
		this.users = data
	},
}

export const handleLogin = async (req, res) => {
	// Extract username and password from the request body
	const { user, pwd } = req.body

	// Check: both username and password must be provided
	if (!user || !pwd) return res.status(400).json({ message: 'Username and password are required!' })

	// Look for the user in the "usersDB" database
	const foundUser = usersDB.users.find(person => person.username === user)

	// If user is not found, return 401 Unauthorized
	if (!foundUser) return res.sendStatus(401)

	// Compare provided password with stored hashed password using bcrypt
	const match = await bcrypt.compare(pwd, foundUser.password)

	if (match) {
		// If password matches, create JWT access and refresh tokens
		const accessToken = jwt.sign(
			{ username: foundUser.username },
			process.env.ACCESS_TOKEN_SECRET,
			{ expiresIn: '30s' } // access token expires in 30 seconds
		)
		const refreshToken = jwt.sign(
			{ username: foundUser.username },
			process.env.REFRESH_TOKEN_SECRET,
			{ expiresIn: '1d' } // refresh token expires in 1 day
		)

		// Update the user database with the refresh token
		const otherUsers = usersDB.users.filter(person => person.username !== foundUser.username)
		const currentUser = { ...foundUser, refreshToken } // add refreshToken to current user
		usersDB.setUsers([...otherUsers, currentUser]) // save updated users list

		// Set the refresh token as an HTTP-only cookie
		res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 })

		// Respond to client with the access token
		res.json({ accessToken }) // this accessToken then usually passed to Authorization: Bearer <token>

		// Persist the updated users database to a JSON file
		await fsPromises.writeFile(path.join(rootDir, 'model', 'users.json'), JSON.stringify(usersDB.users))
	} else {
		// If password doesn't match, return 401 Unauthorized
		res.sendStatus(401)
	}
}
```

### IMPORTANT!

**🚩 Set the cookie before sending the JSON** or send everything **in one response** using `res.status().cookie().json()`

6. Test with **Thunder client**: try to log in again with the same user and password.  
   On the right side you should see **Response:**

```
{
  "accessToken": "..."
}
```

7.  Check **users.json** file: `"refreshToken":"..."` should be added to your user.

8.  Test with **Thunder client**:

    - GET http://localhost:3500/api/employees
    - BODY: `{ "user": "Test1", "pwd": "123456" }`  
      You **will** see the list of employees

9.  Protect route employees with JWT auth:  
    **server.js**

    - `import { verifyJWT } from '#middleware/verifyJWT.js'`
    - before `app.use('/api/employees', employeesRouter)` add `app.use(verifyJWT)`

10. Test with **Thunder client** now:

    - GET http://localhost:3500/api/employees
    - BODY: `{ "user": "Test1", "pwd": "123456" }`  
      You **will not** allowed to see the list of employees.

11. Next test in **Thunder client** should be done very quickly because accessToken lives only 30sec:

        - log in with `{ "user": "Test1", "pwd": "123456" }`
          in Response you will get `{"accessToken": "some_string"}`

          - copy **some_string** to
            GET http://localhost:3500/api/employees -> tab Auth -> Bearer -> Bearer Token

          - send request
            You should see the list of employees. (if not, try log in+copy+request again)

          - Wait for 30 sec and send request with the same token. You will be forbidden to see employees because the jwt token is expired.

    </details>
    <br />
    <br />

<details>
<summary><h3 style="display:inline"><strong>Step 3.1 - Refresh and LogOut</strong></h3></summary>
<br />

1. Update **server.js**:

   - `import cookieParser from 'cookie-parser'`
   - after `app.use(cors(corsOptions))` add `app.use(cookieParser())`

2. Create **refreshController.js**:

```js
// import 'dotenv/config'
import dotenv from 'dotenv'
dotenv.config()

import { rootDir } from '#utils/path.js'
import fs from 'fs'
import jwt from 'jsonwebtoken'
import path from 'path'

const usersDataPath = path.join(rootDir, 'model', 'users.json')

export const usersDB = {
	users: JSON.parse(fs.readFileSync(usersDataPath, 'utf-8')),
	setUsers(data) {
		this.users = data
	},
}

export const handleRefreshToken = (req, res) => {
	// Extract cookies from the request body
	const cookies = req.cookies

	// If cookies are not found, return 401 Unauthorized
	if (!cookies?.jwt) return res.sendStatus(401)

	const refreshToken = cookies.jwt
	console.log('refreshToken:', refreshToken)

	// Look for the user in the "usersDB" database
	const foundUser = usersDB.users.find(person => person.refreshToken === refreshToken)

	// If user is not found, return 401 Unauthorized
	if (!foundUser) return res.sendStatus(403)

	jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
		if (err || foundUser.username !== decoded.username) return res.sendStatus(403)
		//prettier-ignore
		const accessToken = jwt.sign
        (
          { username: decoded.username },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: '30s' }
        )
		res.json({ accessToken })
	})
}
```

3. Create **routes/refresh.js**:

```js
import * as refreshController from '#controllers/refreshController.js'
import { Router } from 'express'

export const refreshRouter = Router()

refreshRouter.get('/', refreshController.handleRefreshToken)
```

4. Update **server.js**: add `app.use('/refresh{/}', refreshRouter)` + import **refreshRouter**
5. Create **logoutController.js**

```js
// import 'dotenv/config'
import dotenv from 'dotenv'
dotenv.config()

import { rootDir } from '#utils/path.js'
import fs from 'fs'
import * as fsPromises from 'fs/promises'
import path from 'path'

const usersDataPath = path.join(rootDir, 'model', 'users.json')

export const usersDB = {
	users: JSON.parse(fs.readFileSync(usersDataPath, 'utf-8')),
	setUsers(data) {
		this.users = data
	},
}

export const handleLogout = async (req, res) => {
	// Extract cookies from the request body
	const cookies = req.cookies

	// If cookies are not found, return 401 Unauthorized
	if (!cookies?.jwt) return res.sendStatus(401)

	const refreshToken = cookies.jwt

	// Look for the user in the "usersDB" database
	const foundUser = usersDB.users.find(person => person.refreshToken === refreshToken)

	// If user is not found -
	if (!foundUser) {
		res.clearCookie('jwt', { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 })
		return res.sendStatus(204)
	}

	const otherUsers = usersDB.users.filter(person => person.refreshToken !== refreshToken)
	const currentUser = { ...foundUser, refreshToken: '' }
	usersDB.setUsers([...otherUsers, currentUser])

	await fsPromises.writeFile(path.json(rootDir, 'model', 'users.json'), JSON.stringify(usersDB.users))

	res.clearCookie('jwt', { httpOnly: true, maxAge: 24 * 60 * 60 * 100 })
	res.sendStatus(204)
}
```

6. Create **routes/logout.js**:

```js
import * as logoutController from '#controllers/logoutController.js'
import { Router } from 'express'

export const logoutRouter = Router()

logoutRouter.get('/', logoutController.handleLogout)
```

7. Update **server.js**:  
   add `app.use('/logout{/}', logoutRouter)` + import **logoutRouter**

<br />

---

</details>

<br />

**REFRESH TOKEN FLOW** (high-level overview):

- **Access tokens** are short-lived (e.g. 30s here).
- **Refresh tokens** are long-lived (stored in httpOnly cookies).
- When the access token expires, the client asks for a new one
  by calling this refresh route with the refresh token cookie.
- If the refresh token is valid and matches a user in DB:
  → Issue a brand-new short-lived access token.
- If not valid, user must log in again.

This keeps access tokens small, disposable, and safe to use on the client side,
while refresh tokens (safer in httpOnly cookies) maintain longer sessions.

<br />
<br />

<details>
<summary><h3 style="display:inline"><strong>Step4 - Roles</strong></h3></summary>
<br />

1. Create **constants/roles-list.js**

```js
export const ROLES_LIST = {
	Admin: 1001,
	Editor: 1002,
	User: 1003,
}
```

2. Update **users.json**

```json
[
	{
		"username": "Test1",
		"roles": {
			"User": 1003
		},
		"password": "$2b$10$gEvOM9o3RK2J7XI/WV8TUeK/87uOOyiLHRjjSwOrDNVfbxbGX1N16",
		"refreshToken": ""
	},
	{
		"username": "Test2",
		"roles": {
			"User": 1003,
			"Admin": 1001
		},
		"password": "$2b$10$gEvOM9o3RK2J7XI/WV8TUeK/87uOOyiLHRjjSwOrDNVfbxbGX1N16"
	},
	{
		"username": "Test3",
		"roles": {
			"User": 1003,
			"Editor": 1002
		},
		"password": "$2b$10$gEvOM9o3RK2J7XI/WV8TUeK/87uOOyiLHRjjSwOrDNVfbxbGX1N16"
	}
]
```

3. Update **registerController.js**:  
   replace `const newUser = { username: user, password: hashedPwd }` with

```js
const newUser = {
	username: user,
	roles: { User: 1003 },
	password: hashedPwd,
}
```

4. Update **authController.js**: replace

```js
const accessToken = jwt.sign(
	{ username: foundUser.username },
	process.env.ACCESS_TOKEN_SECRET,
	{ expiresIn: '30s' } // access token expires in 30 seconds
)
```

with

```js
const roles = Object.values(foundUser.roles)
const accessToken = jwt.sign(
	{
		UserInfo: {
			username: foundUser.username,
			roles: roles,
		},
	},
	process.env.ACCESS_TOKEN_SECRET,
	{ expiresIn: '30s' } // access token expires in 30 seconds
)
```

5. Update **refreshController.js**: replace

```js
const accessToken = jwt.sign({ username: decoded.username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30s' })
```

with

```js
// 7. Extract user roles for embedding in the new access token
const roles = Object.values(foundUser.roles)

// 8. Create a new short-lived access token
//    - Includes username and roles inside "UserInfo"
//    - Signed with ACCESS_TOKEN_SECRET
//    - Expiration set to 30 seconds
// prettier-ignore
const accessToken = jwt.sign(
			{
				"UserInfo": {
					"username": decoded.username,
					"roles": roles,
				}
			},
			process.env.ACCESS_TOKEN_SECRET,
			{ expiresIn: '30s' }
		)
```

6. Update **verifyJWT.js**

```js
import jwt from 'jsonwebtoken'

import dotenv from 'dotenv'
dotenv.config()

export const verifyJWT = (req, res, next) => {
	// Extract the "Authorization" header from the request
	const authHeader = req.headers.authorization || req.headers.Authorization

	// Log the raw Authorization header (e.g. "Bearer eyJhbGciOiJIUzI1NiIs...")
	console.log('authHeader:', authHeader)

	// If no Bearer Authorization header is present, the client is not authenticated → 401 Unauthorized
	if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401)

	// Split the header: "Bearer <token>" → take only the token part
	const token = authHeader.split(' ')[1]

	// Verify the token with the secret key
	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
		// If verification fails (expired, invalid, or tampered token) → 403 Forbidden
		if (err) {
			console.log(err.message)
			return res.sendStatus(403)
		}

		// If valid, attach the decoded username and roles to the request object
		// so other middleware/routes can know which user is making the request and if this user authorized to do it
		req.user = decoded.UserInfo.username
		req.roles = decoded.UserInfo.roles

		// Call the next middleware or route handler
		next()
	})
}
```

7. Create **middleware/verifyRoles.js**

```js
// Middleware to verify if the user has one of the allowed roles
export const verifyRoles = (...allowedRoles) => {
	// "allowedRoles" is a rest parameter → it collects all arguments into an array
	// Example: verifyRoles('Admin', 'Editor')

	return (req, res, next) => {
		// 1. If the request object has no roles attached, reject with Unauthorized
		if (!req?.roles) return res.sendStatus(401)

		// 2. Copy allowedRoles into a new array (for clarity/logging)
		const rolesArray = [...allowedRoles]
		console.log('Allowed roles:', rolesArray)
		console.log('User roles:', req.roles)

		// 3. Compare user roles against allowed roles
		//    - For each role in req.roles, check if it’s in allowedRoles
		//    - "map" returns [true/false/...]
		//    - "find" returns the first true, or undefined if none
		const result = req.roles.map(role => rolesArray.includes(role)).find(val => val === true)

		// 4. If no matching role found → Unauthorized
		if (!result) return res.sendStatus(401)

		// 5. Otherwise, user has permission → move to the next middleware/route
		next()
	}
}
```

8. Update **routes/api/employees.js**:

```js
import { ROLES_LIST } from '#constants/roles-list.js'
import * as empService from '#controllers/employeesController.js'
import { verifyRoles } from '#middleware/verifyRoles.js'
import { Router } from 'express'

export const employeesRouter = Router()

//# ------------------------------- All employees
employeesRouter
	.route('/')
	.get(empService.getAllEmployees)
	.post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), empService.createNewEmployee)
	.delete(verifyRoles(ROLES_LIST.Admin), empService.deleteAllEmployees)

//# ------------------------------- Single employee
employeesRouter
	.route('/:id')
	.get(empService.getSingleEmployee)
	.put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), empService.updateEmployee)
	.delete(verifyRoles(ROLES_LIST.Admin), empService.deleteSingleEmployee)
```

<br />

---

</details>
<br />

### **For using in Thunder client**:

```
+-----------------------------------------------------------------------------------------------+
| action             | method, path, needed data                 | response success/unsuccess   |
+-----------------------------------------------------------------------------------------------+
| logout 		     | GET http://localhost:3500/logout          | 204 204 No Content           |
|                    |                                           | 401 Unauthorized             |
+-----------------------------------------------------------------------------------------------+
| log in/auth        | POST http://localhost:3500/auth           | 200 OK                       |
|                    | BODY { "user": "Test1", "pwd": "123456"}  | 401 Unauthorized             |
+-----------------------------------------------------------------------------------------------+
| get employees      | GET http://localhost:3500/api/employees   | 200 OK                       |
| (protected API)    | Auth/Bearer `accessToken                  | 403 Forbidden                |
+-----------------------------------------------------------------------------------------------+
| register           | POST http://localhost:3500/register       | 201 Created                  |
|                    | BODY { "user": "Test1", "pwd": "123456" } | 400 Bad Request/409 Conflict |
+-----------------------------------------------------------------------------------------------+
| refresh token      | GET http://localhost:3500/refresh         | 200 OK                       |
|                    |                                           | 401 Unauthorized             |
+-----------------------------------------------------------------------------------------------+
```
