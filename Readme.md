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


npm install better-sqlite3 //?
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
