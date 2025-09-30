```js
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
```

<br />
<br />

### 🔹 1. `io.on(...)` — **listening for new connections**

```js
io.on('connection', socket => {
	// runs once per client when they connect
})
```

- `io` = the server-side Socket.IO instance.
- `'connection'` = **built-in event** that fires when a new client connects.
- `socket` = the **unique connection object** for that client (their private channel).

👉 Think of io as **the whole chat room**, and `socket` as **the individual person** entering the room.

---

### 🔹 2. `socket.on(...)` — **listening for events from one client**

```js
socket.on('chatMessage', msg => { ... })
```

- `socket` listens for events sent by **that one client**.
- `'chatMessage'` is **not built-in** — it’s a **custom event name** you invent.
- The client (browser) must emit with the same name:

```js
socket.emit('chatMessage', 'Hello!')
```

#### 👉 Analogy:

- Client raises their hand and says: "Event: `chatMessage`, data: `Hello!`".
- Server listens for that event and reacts.

---

### 🔹 3. `io.emit(...)` — **broadcasting to all clients**

```js
io.emit('chatMessage', { user, message: msg })
```

- `io.emit` means: "Send this event to **everyone connected**".
- Event name `'chatMessage'` is **again arbitrary** (just must match on the client).
- The client listens like this:

```js
socket.on('chatMessage', data => { ... })
```

#### 👉 Analogy:

- Teacher says something out loud (`io.emit`).
- Every student (`socket.on`) hears it.

---

### **🔹 Flow in this example**:

1. Client emits: `socket.emit('chatMessage', 'Hi!')`
2. Server listens: `socket.on('chatMessage', msg => { ... })`
3. Server re-broadcasts: `io.emit('chatMessage', { user, message: msg })`
4. All clients listen: `socket.on('chatMessage', data => { ... })`

---

### **⚡ Short intuition:**

- `io.on('connection', ...) `→ "When someone enters the room".
- `socket.on('something', ...)` → "When this person says something".
- `io.emit('something', ...)` → "Tell it to the whole room".

---

<br />
<br />

# 🔹 **Built-in vs Custom Events**

- **Built-in events:**

  - `'connect'`, `'connection'`, `'disconnect'`, `'connect_error'`, etc.
  - Already defined by Socket.IO.

- **Custom events:**

  - `'chatMessage'`, `'sendNotification'`, `'typing'`, etc.
  - You choose the names — they are just strings.

## They must match between **server emit** ↔ **client on** and **client emit** ↔ **server on**.

### 🔑 Built-in Events

| Event name      | Where it fires | What it means                                                                       | Example use                                    |
| :-------------- | :------------- | :---------------------------------------------------------------------------------- | :--------------------------------------------- |
| `connect`       | **Client**     | Fired when the client successfully connects to the server                           | Show "Connected" message, get socket.id        |
| `connection`    | **Server**     | Fired whenever a new client connects                                                | Log new users, initialize data for that client |
| `disconnect`    | **Both**       | Fired when a client disconnects (network drop, page closed, server kicked them out) | Clean up resources, notify others              |
| `connect_error` | **Client**     | Fired if the connection fails (wrong token, server down, CORS issue, etc.)          | Retry connection, show error                   |
| `error`         | **Both**       | Generic error event, less common in practice                                        | Debug unexpected issues                        |

### **📡 Message Flow (custom events)**

- Anything that’s **not in the table above** (like "`chatMessage`", "`sendNotification`", "`typing`") is **custom** — you name it yourself.

### 🎯 Rule of thumb:

- `socket.emit('eventName', data)` → send event/data to the server.
- `socket.on('eventName', handler)` → listen for it (on client or server).
- The server can then `io.emit(...)` or `socket.broadcast.emit(...)` to spread it around.

### **Example Timeline**

1. Client opens page → `connect` (client) fires.
2. Server notices → `connection` (server) fires.
3. Client sends `chatMessage` → `socket.emit('chatMessage', msg)`.
4. Server listens → `socket.on('chatMessage', ...)`.
5. Server forwards → `io.emit('chatMessage', {...})`.
6. All clients catch it → `socket.on('chatMessage', ...)`.
7. If client closes page → `disconnect` fires on both ends.
