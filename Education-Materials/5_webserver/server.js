import { __dirname } from '#utils/path.js'
import { serveFile } from '#utils/serveFile.js'
import { EventEmitter } from 'events'
import { existsSync } from 'fs'
import http from 'http'
import path from 'path'
import logEvents from './logEvents.js'

//* --------------------- Initialize Event Emitter Object
class MyEmitter extends EventEmitter {}
const emitter = new MyEmitter()

//* --------------------- Listen For The Log Event
emitter.on('log', (msg, fileName) => logEvents(msg, fileName))

//* --------------------- Port Definition
const PORT = process.env.PORT || 3500

//* --------------------- Server
const server = http.createServer((req, res) => {
	//write to log file
	emitter.emit('log', `${req.url}\t${req.method}`, 'reqLog.txt')

	//# --------------------- Extension and Content Type
	const extension = path.extname(req.url)

	let contentType
	// prettier-ignore
	switch (extension) {
		case '.css': contentType = 'text/css'; break
		case '.js': contentType = 'text/javascript'; break
		case '.json':	contentType = 'application/json';	break
		case '.jpg': contentType = 'image/jpeg'; break
		case '.png': contentType = 'image/png';	break
		case '.txt': contentType = 'text/plain'; break
		default: contentType = 'text/html'
	}

	//# --------------------- Handle HTML redirects
	let redirectPath = req.url
	if (contentType === 'text/html' && !extension) {
		if (req.url.endsWith('/')) redirectPath += 'index.html' // /blog/ → /blog/index.html
		else redirectPath += '.html' // /about → /about.html

		res.writeHead(301, { Location: redirectPath })
		res.end()
		return
	}

	//# --------------------- Build File Path
	const filePath = contentType === 'text/html' ? path.join(__dirname, 'view', req.url) : path.join(__dirname, req.url)

	//# --------------------- Check and Serve File
	const fileExists = existsSync(filePath)

	if (fileExists) {
		serveFile(filePath, contentType, res, emitter)
	} else {
		switch (path.parse(filePath).base) {
			case 'old-page.html':
				res.writeHead(301, { Location: '/new-page.html' })
				res.end()
				break
			case 'www-page.html':
				res.writeHead(301, { Location: '/' })
				res.end()
				break
			default:
				//NB show 404.html but does not change address
				serveFile(path.join(__dirname, 'view', '404.html'), 'text/html', res, emitter)

			//NB redirect and new address is 404.html
			// emitter.emit('log', `Not Found: ${req.url}; Redirect to: 404.html`, 'reqLog.txt')
			// res.writeHead(301, { Location: '/404' })
			// res.end()
		}
	}
})

server.listen(PORT, () => console.log(`Server running on port ${PORT}`))
