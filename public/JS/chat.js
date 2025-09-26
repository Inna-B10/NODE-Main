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
	document.getElementById('message').appendChild(item)
})

socket.on('notification', msg => {
	const item = document.createElement('li')
	item.textContent = 'Notification: ' + msg
	document.getElementById('message').appendChild(item)
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
