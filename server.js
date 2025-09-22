import { corsOptions } from '#config/corsOptions.js'
import { errorHandler } from '#middleware/errorHandler.js'
import { logger } from '#middleware/logEvents.js'
import { verifyJWT } from '#middleware/verifyJWT.js'
import { aboutRouter } from '#routes/about.js' // Import the router
import { employeesRouter } from '#routes/api/employees.js'
import { authRouter } from '#routes/auth.js'
import { logoutRouter } from '#routes/logout.js'
import { refreshRouter } from '#routes/refresh.js'
import { registerRouter } from '#routes/register.js'
import { rootRouter } from '#routes/root.js'
import { subdirRouter } from '#routes/subdir/subdir.js' // Import the router
import { rootDir } from '#utils/path.js'
import cookieParser from 'cookie-parser'
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

//cookie
app.use(cookieParser())

//* ----------------------------- Attach Routers ----------------------------- */
app.use('/', rootRouter)
app.use('/subdir{/}', subdirRouter)
app.use('/about{/}', aboutRouter)
app.use('/register{/}', registerRouter)
app.use('/auth{/}', authRouter)
app.use('/refresh{/}', refreshRouter)
app.use('/logout{/}', logoutRouter)

app.use(verifyJWT)
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
