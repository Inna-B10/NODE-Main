import cors from 'cors'
import express from 'express'
import path from 'path'
import { errorHandler } from './middleware/errorHandler.js'
import { logger } from './middleware/logEvents.js'

const PORT = process.env.PORT || 3500
const app = express()

// MIDDLEWARES
app.use(logger)

//cors
const whitelist = ['https://www.this-site-is-allowed.com', 'http://127.0.0.1:5500', 'http://localhost:3500']
const corsOptions = {
	origin: (origin, callback) => {
		if (whitelist.indexOf(origin) !== -1 || !origin) callback(null, true)
		else callback(new Error('Blocked by CORS!'))
		console.log('origin: ', origin)
	},
	optionsSuccessStatus: 200,
}
app.use(cors(corsOptions))

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(express.static(path.join(rootDir, '/public')))

//routes
app.get(['/', '/index', '/index.html'], (req, res) => {
	res.sendFile(path.join(rootDir, 'view', 'index.html'))
})

app.get('/new-page{.:html}', (req, res) => {
	res.sendFile(path.join(rootDir, 'view', 'new-page.html'))
})

app.get('/old-page{.:html}', (req, res) => {
	res.redirect(301, '/new-page.html')
})

app.get('/404{.:html}', (req, res) => {
	res.sendFile(path.join(rootDir, 'view', '404.html'))
})
//404 API
app.all('/api/*', (req, res) => {
	res.status(404).json({ error: 'API endpoint not found' })
})
//404 HTML
app.use((req, res) => {
	res.status(404).sendFile(path.join(rootDir, 'view', '404.html'))
})

// error handler
app.use(errorHandler)

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
