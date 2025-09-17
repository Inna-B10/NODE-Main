import { errorHandler } from '#middleware/errorHandler.js'
import { logger } from '#middleware/logEvents.js'
import subdirRouter from '#routes/subdir/subdir.js' // Import the router
import { rootDir } from '#utils/path.js'
import cors from 'cors'
import express from 'express'
import path from 'path'

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

//Use the router for the /subdir path
app.use('/subdir', subdirRouter)

//routes
app.get(['/', '/index', '/index.html'], (req, res) => {
	res.sendFile(path.join(rootDir, 'view', 'index.html'))
})

app.get('/new-page{.:html}', (req, res) => {
	res.sendFile(path.join(rootDir, 'view', 'new-page.html'))
})

app.get('/about{/}', (req, res) => {
	res.sendFile(path.join(rootDir, 'view', 'about', 'index.html'))
})

app.get('/old-page{.:html}', (req, res) => {
	res.redirect(301, '/new-page.html')
})

app.get('/404{.:html}', (req, res) => {
	res.sendFile(path.join(rootDir, 'view', '404.html'))
})

//404 API
app.all('/api/:path', (req, res) => {
	res.status(404).json({ error: 'API endpoint not found', path: req.params.path })
})
//more modern method is to use middleware
// app.use('/api', (req, res) => {
// 	res.status(404).json({ error: 'API endpoint not found', path: req.params.path  })
// })

//404 HTML
app.use((req, res) => {
	res.status(404).sendFile(path.join(rootDir, 'view', '404.html'))
})

// error handler
app.use(errorHandler)

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
