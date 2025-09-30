//NB ⚠ Security Note: Storing JWT in localStorage is vulnerable to XSS attacks.
//NB If malicious JS is injected into your site, it can steal the token.
//NB Alternative: use httpOnly secure cookies for better protection.

// Retrieve JWT token from localStorage
const token = localStorage.getItem('token')

//NB ⚠ Important: Token is exposed in the client-side JS.
//NB Always validate token server-side and reject invalid/expired ones.

// Initialize socket.io client with token in auth payload
const socket = io({ auth: { token: token } })

//* --------------------------- Send A Chat Message -------------------------- */
function sendMessage() {
	const input = document.getElementById('msgInput')
	const message = input.value.trim()

	if (message) {
		//NB ⚠ Consider rate limiting / spam protection server-side
		socket.emit('chatMessage', message) // Emit message to server
		input.value = ''
	}
}

//* --------------------------- Send A Notification -------------------------- */
function sendNotification() {
	//NB ⚠ Make sure only authorized users can send sensitive events
	socket.emit('sendNotification', 'A new user has registered!')
}

// Listen for chat messages from server
socket.on('chatMessage', msg => {
	const item = document.createElement('li')
	if (typeof msg === 'object' && msg.user) {
		//NB ⚠ Never trust client-sent usernames. Always sanitize server-side.
		item.textContent = `${msg.user}: ${msg.message}`
	} else {
		item.textContent = msg
	}

	// Append new message to chat list
	document.getElementById('messages').appendChild(item)
})

// Listen for notifications from server
socket.on('notification', msg => {
	const item = document.createElement('li')

	//NB ⚠ Sanitize incoming strings if they can contain user input
	item.textContent = 'Notification: ' + msg
	document.getElementById('messages').appendChild(item)
})

// Handle successful socket connection
socket.on('connect', () => {
	console.log('Connected with socket ID: ', socket.id) //client console
})

// Handle connection errors (e.g., token expired)
socket.on('connect_error', err => {
	// Try to refresh token if expired
	if (err.message === 'Token expired') {
		//NB ⚠ Refresh token flow: token refresh endpoint should be secure
		//NB   - Use short-lived access tokens
		//NB   - Issue refresh token as httpOnly cookie
		//NB   - Avoid exposing refresh tokens to JavaScript
		fetch('/refresh', {
			method: 'GET',
			credentials: 'include', // Ensures cookies are sent
		})
			.then(res => res.json())
			.then(data => {
				//NB ⚠ Still storing new token in localStorage (same risk as before).
				//NB Better: set it via httpOnly cookie on the server.
				localStorage.setItem('token', data.accessToken) // Save new token
				window.location.reload() // Reload to reconnect with new token
			})
			.catch(() => {
				console.error('Failed to refresh users token')
			})
	} else {
		console.error('Connection failed: ', err.message)
	}
})
