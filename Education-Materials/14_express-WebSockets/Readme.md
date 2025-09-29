# Express: Integrating SQL

<details>
<summary>used libraries:</summary>

```js
npm init -y
npm install date-fns, express, uuid
npm install nodemon -D
npm install nodemone -g
npm install cors
npm install express socket.io
npm install better-sqlite3
npm install jsonwebtoken

//?
npm install bcrypt
npm install dotenv
npm install cookie-parser
```

</details>

<br />

### **👉 [app.listen(...) VS server.listen(...)](app_listen_VS_server_listen.md)**

### **👉 [server-client-flow](server-client-flow.md)**

### **👉 [minimal primitive chat example (GPT-chat)](minimal_primitive_chat.md)**

<details>
<summary><h2 style="display:inline"><strong>Part 1</strong></h2></summary>

### 1. Update **server.js**

```js
import { chatRouter } from '#routes/chat.js'
import http from 'http'
import { Server } from 'socket.io'

//after const app = express()
const server = http.createServer(app)
const io = new Server(server)

//after app.use('/', rootRouter)
app.use('/chat', chatRouter)
```

- replace `` app.listen(PORT, () => console.log(`Server running on port ${PORT}`)) `` with

```js
//webSocket
io.on('connection', socket => {
	console.log('WebSocket connected: ', socket.id)
	socket.on('chatMessage', msg => {
		io.emit('chatMessage', msg)
	})

	socket.on('disconnect', () => {
		console.log('WebSocket disconnected')
	})
})

server.listen(PORT, () => console.log(`Server running on port ${PORT}`))
```

### 2. Create **view/chat.html**:

```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>Live Chat</title>
		<script src="/socket.io/socket.io.js"></script>
		<link rel="stylesheet" href="./css/chat.css" />
	</head>
	<body>
		<h1>Live Chat</h1>

		<input type="text" id="msgInput" placeholder="Write a message..." />
		<button id="sendButton">Send</button>

		<ul id="messages"></ul>

		<script src="./JS/chat.js"></script>
	</body>
</html>
```

### 3. Create **public/css/chat.css**:

```css
body {
	font-family: sans-serif;
	margin: 2rem;
}

input {
	padding: 0.5rem;
	width: 250px;
}

button {
	padding: 0.5rem;
}

ul {
	list-style: none;
	padding: 0;
}

li {
	margin: 0.3rem 0;
	padding: 0.3rem;
	background-color: #f1f1f1;
	border-radius: 4px;
}
```

### 4. Create **public/JS/chat.js**:

```js
const token = localStorage.getItem('token')

const socket = io({ auth: { token: token } })

function sendMessage() {
	const input = document.getElementById('msgInput')
	const message = input.value.trim()

	if (message) {
		socket.emit('chatMessage', message)
		input.value = ''
	}
}

function sendNotification() {
	socket.emit('sendNotification', 'A new user has registered!')
}

socket.on('chatMessage', msg => {
	const item = document.createElement('li')
	if (typeof msg === 'object' && msg.user) {
		item.textContent = `${msg.user}: ${msg.message}`
	} else {
		item.textContent = msg
	}
	document.getElementById('messages').appendChild(item)
})

socket.on('notification', msg => {
	const item = document.createElement('li')
	item.textContent = 'Notification: ' + msg
	document.getElementById('messages').appendChild(item)
})

socket.on('connect', () => {
	console.log('Connected with socket ID: ', socket.id)
})

socket.on('connect_error', err => {
	if (err.message === 'Token expired') {
		fetch('/refresh', {
			method: 'GET',
			credentials: 'include',
		})
			.then(res => res.json())
			.then(data => {
				localStorage.setItem('token', data.accessToken)
				window.location.reload()
			})
			.catch(() => {
				console.error('Failed to refresh users token')
			})
	} else {
		console.error('Connection failed: ', err.message)
	}
})
```

### 5. Create **routes/chat.js**:

```js
import { rootDir } from '#utils/path.js'
import { Router } from 'express'
import path from 'path'

export const chatRouter = Router()

chatRouter.get('/', (req, res) => {
	res.sendFile(path.join(rootDir, 'view', 'chat.html'))
})
```

</details>
<br />
<br />

 <details>
	<summary><h2 style="display:inline"><strong>Part 2</strong></h2></summary>

1. ### Update **server.js**:

replace all berween `app.use(errorHandler)` and `server.listen(PORT, () => console.log("Server running on port ${PORT}"))` with

```js
//* -------------------------------- WebSocket ------------------------------- */

// io.use((socket, next) => {
// 	const token = socket.handshake.auth.token
//
// 	if (!token) {
// 		return next(new Error('Authentication failed: No token provided'))
// 	}
// 	try {
// 		const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
// 		socket.user = decoded
// 		next()
// 	} catch (err) {
// 		return next(new Error('Authentication failed: Invalid token'))
// 	}
// })

io.on('connection', socket => {
	console.log('WebSocket connected: ', socket.id)

	socket.on('chatMessage', msg => {
		const user = socket.user?.username || 'Anonymous'
		console.log('Message received: ', msg)
		io.emit('chatMessage', { user, message: msg })
	})

	socket.on('sendNotification', msg => {
		io.emit('notification', msg)
	})

	socket.on('disconnect', () => {
		console.log('WebSocket disconnected')
	})
})

//* -------------------------------------------------------------------------- */
```

2. ### Update **chat.html**:

```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>Live Chat</title>
		<script src="/socket.io/socket.io.js"></script>
		<link rel="stylesheet" href="./css/chat.css" />
	</head>
	<body>
		<h1>Live Chat</h1>

		<input type="text" id="msgInput" placeholder="Write a message..." />
		<button id="sendButton" onclick="sendMessage()">Send</button>
		<button onclick="sendNotification()">Send Notification</button>

		<ul id="messages"></ul>

		<script src="./JS/chat.js"></script>
	</body>
</html>
```

3. ### Update **database/database.js**:
   replace `console.log('The DB and table "employees" have been created!')` with

```js
db.prepare(
	`CREATE TABLE IF NOT EXISTS projects
  (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id INTEGER NOT NULL,
    project_name TEXT NOT NULL,
    deadline TEXT,
    FOREIGN KEY (employee_id) REFERENCES employees(id)
  )`
).run()

db.prepare(
	`CREATE TABLE IF NOT EXISTS skills
    (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    )`
).run()

db.prepare(
	`CREATE TABLE IF NOT EXISTS employee_skills 
    (
      employee_id INTEGER NOT NULL,
      skill_id INTEGER NOT NULL,
      PRIMARY KEY (employee_id, skill_id),
      FOREIGN KEY (employee_id) REFERENCES employees(id),
      FOREIGN KEY (skill_id) REFERENCES skills(id)
    )`
).run()

console.log('The DB and tables have been created!')
```

4. ### Start the server

5. ### Open the program **DB Browser for SQLite**:

- check if new tables `projects`, `skills` and `employee_skills` have been created
- tab **Execute SQL** --> execute:

```sql
INSERT INTO projects (employee_id, project_name, deadline)
VALUES (40, "Project Blue Book", "2025-09-01");
```

```sql
INSERT INTO projects (employee_id, project_name, deadline)
VALUES (40, "Project Bluebeam", "2025-09-01")
```

```sql
INSERT INTO skills (name) VALUES("Digging");
INSERT INTO skills (name) VALUES("Driving");
INSERT INTO skills (name) VALUES("Hairstyling");
INSERT INTO skills (name) VALUES("Receptionist");
INSERT INTO skills (name) VALUES("Fullstack developer");
INSERT INTO skills (name) VALUES("Customer support");
```

```sql
INSERT INTO employee_skills (employee_id, skill_id) VALUES (35, 5);
INSERT INTO employee_skills (employee_id, skill_id) VALUES (42, 6);
INSERT INTO employee_skills (employee_id, skill_id) VALUES (12, 3);
INSERT INTO employee_skills (employee_id, skill_id) VALUES (15, 1);
INSERT INTO employee_skills (employee_id, skill_id) VALUES (50, 4);
INSERT INTO employee_skills (employee_id, skill_id) VALUES (26, 2);
```

- tab **Brawse Data** -> choose Table:

  - "projects" -> see records
  - "skills" -> see records
  - "employee_skills" -> see records

- save Project

6. ### Create **queries\projectsWithEmployee.js**:

```js
import { db } from '../database/database.js'

export function getProjectsWithEmployee() {
	return db
		.prepare(
			`
      SELECT projects.project_name, projects.deadline, employees.first_name, employees.last_name FROM projects INNER JOIN employees ON projects.employee_id = employees.id
      `
		)
		.all()
}
```

7. ### Create **routes/projects.js**

```js
import { Router } from 'express'
import { getProjectsWithEmployee } from '../queries/projectsWithEmployee.js'

export const projectsRouter = new Router()

projectsRouter.get('/active-projects', (req, res) => {
	const data = getProjectsWithEmployee()
	res.json(data)
})
```

8. ### Update **server.js**:

   after `app.use('/chat', chatRouter)` add `app.use("/projects", projectsRouter)` + import router

9. ### Open browser:
   `http://localhost:3500/projects/active-projects`

Result should be:

```
[
  {
    "project_name": "Project Blue Book",
    "deadline": "2025-09-01",
    "first_name": "Joshua",
    "last_name": "Walker"
  },
  {
    "project_name": "Project Bluebeam",
    "deadline": "2025-09-01",
    "first_name": "Joshua",
    "last_name": "Walker"
  }
]
```

</details>
