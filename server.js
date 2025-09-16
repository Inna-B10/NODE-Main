import { __dirname } from '#utils/path.js'
import cors from 'cors'
import express from 'express'
import path from 'path'
import { logger } from './middleware/logEvents.js'

const PORT = process.env.PORT || 3500
const app = express()

//* --------------------- Custom middleware
app.use(logger)

//* --------------------- Third-Party Middleware
const whitelist = ['https://www.this-site-is-allowed.com', 'http://127.0.0.1:5500', 'http://localhost:3500']

//# --------------------- Cors
const corsOptions = {
	origin: (origin, callback) => {
		if (whitelist.indexOf(origin) !== -1 || !origin) callback(null, true)
		else callback(new Error('Blocked by CORS!'))
		console.log('origin: ', origin)
	},
	optionsSuccessStatus: 200,
}
app.use(cors(corsOptions))

//* --------------------- Internal/built-in Middleware Express
//# --------------------- HTML form parser
app.use(express.urlencoded({ extended: false }))

//NB A parser for data from HTML forms submitted with the type
//NB Content-Type: application/x-www-form-urlencoded
//NB (the standard <form method="POST"> without enctype="multipart/form-data")

//NB extended: false → uses a "simple" parser, does not support nested objects
//name=Alex&age=25     → { name: "Alex", age: "25" }
//user[name]=Alex      → { "user[name]": "Alex" }  // т.к. false

//NB extended: true → uses the qs library, which can turn such things into objects
//user[name]=Alex&user[age]=25  → { user: { name: "Alex", age: "25" } }

//# --------------------- JSON parser
app.use(express.json())

//NB A parser for a request body with Content-Type: application/json.
//NB It automatically takes the JSON string from the body and turns it into a JS object available as req.body
/*
POST /api/user
Content-Type: application/json
{
  "name": "Alex",
  "age": 25
}
 After that in Express:
app.post("/api/user", (req, res) => {
  console.log(req.body); // { name: 'Alex', age: 25 }
})
*/

//# --------------------- Static files
app.use(express.static(path.join(__dirname, '/public'))) //css,img,text

//NB Processes only GET and HEAD requests, returning files from the specified folder

//* --------------------- Route Handler
//# root
// app.get('/', (req, res) => {
// 	// res.send('Hello world!')
// 	// res.sendFile('./view/index.html', { root: __dirname }) //v1
// 	res.sendFile(path.join(__dirname, 'view', 'index.html'))	//v2
// })

//# root med regex
// app.get(/^\/$|\/index(.html)?/, (req, res) => {
// 	res.sendFile(path.join(__dirname, 'view', 'index.html'))
// })

//# root med array
app.get(['/', '/index', '/index.html'], (req, res) => {
	res.sendFile(path.join(__dirname, 'view', 'index.html'))
})

//# different files
app.get('/new-page{.:html}', (req, res) => {
	res.sendFile(path.join(__dirname, 'view', 'new-page.html'))
})

//# redirect
app.get('/old-page{.:html}', (req, res) => {
	res.redirect(301, '/new-page.html') //redirect + new address in the browser "new-page.html"
})

//# 404.html
app.get('/404{.:html}', (req, res) => {
	res.sendFile(path.join(__dirname, 'view', '404.html'))
})

//* --------------------- Custom middlewares
//# 404 handler - everything else (non-existent)
app.use((req, res) => {
	res.status(404).sendFile(path.join(__dirname, 'view', '404.html'))
})
//NB uses built-in Express methods, but is written by user - it is custom middleware

//# error handler
app.use(function (err, req, res, next) {
	console.error(err.stack)
	res.status(500).send(err.message)
})
//NB Order matters: middlewares first, then route handlers, then 404, last - error handler!
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
