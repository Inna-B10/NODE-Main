# Minimal primitive chat

### **1. server.js:**

```js
import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import path from 'path'

const PORT = process.env.PORT || 3500
const rootDir = process.cwd() // assuming your public folder is in project root

// ---------------------- Express app ----------------------
const app = express()

// Serve static files (HTML, JS) from /public
app.use(express.static(path.join(rootDir, 'public')))

// ---------------------- Create HTTP server + Socket.IO ----------------------
const server = http.createServer(app)
const io = new Server(server)

// ---------------------- WebSocket logic ----------------------
io.on('connection', socket => {
	console.log('WebSocket connected: ', socket.id)

	// Listen for chat messages from client
	socket.on('chatMessage', msg => {
		// Broadcast message to all connected clients
		io.emit('chatMessage', msg)
	})

	// Handle client disconnect
	socket.on('disconnect', () => {
		console.log('WebSocket disconnected: ', socket.id)
	})
})

// ---------------------- Start server ----------------------
server.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})
```

### ✅ What’s included:

- Express app to serve static HTML/JS (**/public**)
- HTTP server (**server**) used by Socket.IO
- Socket.IO logic for sending/receiving chat messages
- Server listen on a port

### ❌ What’s removed:

- Extra routers (/api/employees, /chat)
- Middleware like cors, logger, body parsers
- 404/error handlers
- Database close logic

---

<br />

### **2. public/index.html**

```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<title>Simple Chat</title>
		<style>
			body {
				font-family: sans-serif;
				max-width: 600px;
				margin: 20px auto;
			}
			ul {
				list-style: none;
				padding: 0;
			}
			li {
				padding: 5px 0;
			}
			input {
				width: 80%;
				padding: 5px;
			}
			button {
				padding: 5px 10px;
			}
		</style>
	</head>
	<body>
		<h1>Simple Chat</h1>
		<ul id="messages"></ul>
		<input id="msgInput" type="text" placeholder="Type a message..." />
		<button id="sendBtn">Send</button>

		<script src="/socket.io/socket.io.js"></script>
		<script src="chat.js"></script>
	</body>
</html>
```

<br />

### **3. public/chat.js**

```js
// Connect to Socket.IO
const socket = io() // no token for now

const messagesList = document.getElementById('messages')
const input = document.getElementById('msgInput')
const sendBtn = document.getElementById('sendBtn')

// Send message on button click
sendBtn.addEventListener('click', () => {
	const message = input.value.trim()
	if (message) {
		socket.emit('chatMessage', message) // send to server
		input.value = ''
	}
})

// Send message on Enter key
input.addEventListener('keydown', e => {
	if (e.key === 'Enter') sendBtn.click()
})

// Listen for chat messages from server
socket.on('chatMessage', msg => {
	const li = document.createElement('li')
	li.textContent = msg
	messagesList.appendChild(li)
	window.scrollTo(0, document.body.scrollHeight) // scroll to bottom
})
```

<br />

## ✅ Features:

- Users can type messages and press Send or Enter.
- Messages are broadcast to all connected clients.
- Minimal styling for readability.
- No token/auth yet, simple for testing chat.
