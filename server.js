import { corsOptions } from '#config/corsOptions.js'
import { errorHandler } from '#middleware/errorHandler.js'
import { logger } from '#middleware/logEvents.js'
import { employeesRouter } from '#routes/api/employees.js'
import { rootRouter } from '#routes/root.js'
import { rootDir } from '#utils/path.js'
import cors from 'cors'
import express from 'express'
import path from 'path'

const PORT = process.env.PORT || 3500
const app = express()

//* ------------------------------- Middleware ------------------------------- */
app.use(logger)

//cors
app.use(cors(corsOptions))

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(express.static(path.join(rootDir, '/public')))

//* ----------------------------- Attach Routers ----------------------------- */
app.use('/', rootRouter)

// API router
app.use('/api/employees', employeesRouter)

//* ------------------------ 404 And ErrorHandler Middlewares ----------------------- */

// 404 HTML
app.use((req, res) => {
	res.status(404).sendFile(path.join(rootDir, 'view', '404.html'))
})

// 404 API
app.use('/api', (req, res) => {
	res.status(404).json({ error: 'API endpoint not found', path: req.params.path })
})

// error handler
app.use(errorHandler)

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
