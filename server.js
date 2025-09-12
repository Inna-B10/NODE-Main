import { __dirname } from '#utils/path.js'
import { serveFile } from '#utils/serveFile.js'
import { EventEmitter } from 'events'
import { existsSync } from 'fs'
import http from 'http'
import path from 'path'
import logEvents from './logEvents.js'

//initialize event emitter object
class MyEmitter extends EventEmitter {}
const emitter = new MyEmitter()

//listen for the log event
emitter.on('log', (msg, fileName) => logEvents(msg, fileName))

//port definition
const PORT = process.env.PORT || 3500
const server = http.createServer((req, res) => {
	//write to log file
	console.log(req.url, req.method)
	emitter.emit('log', `${req.url}\t${req.method}`, 'reqLog.txt')

	//set content type
	let contentType
	const extensions = path.extname(req.url)

	switch (extensions) {
		case '.css':
			contentType = 'text/css'
			break
		case '.js':
			contentType = 'text/javascript'
			break
		case '.json':
			contentType = 'application/json'
			break
		case '.jpg':
			contentType = 'image/jpeg'
			break
		case '.png':
			contentType = 'image/png'
			break
		case '.txt':
			contentType = 'text/plain'
			break
		default:
			contentType = 'text/html'
	}
	console.log('contentType', contentType)
	console.log('extensions', extensions)

	//build file path
	let filePath =
		contentType === 'text/html' && req.url === '/'
			? path.join(__dirname, 'view', 'index.html')
			: contentType === 'text/html' && req.url.slice(-1) === '/' //http://localhost:3500/new-page/
			? path.join(__dirname, 'view', req.url, 'index.html') //filePath E:\DEVELOP\NODE\5_webserver\view\new-page\index.html
			: contentType === 'text/html'
			? path.join(__dirname, 'view', req.url)
			: path.join(__dirname, req.url)

	if (!extensions && req.url.slice(-1) !== '/') filePath += '.html'
	console.log('filePath', filePath)

	//check if file exists
	const fileExists = existsSync(filePath)

	if (fileExists) {
		if (!extensions && req.url.slice(-1) !== '/') {
			// f.ex. /about → /about.html
			res.writeHead(301, { Location: req.url + '.html' })
			res.end()
			return
		}

		if (!extensions && req.url.slice(-1) === '/') {
			// f.ex. /blog/ → /blog/index.html
			res.writeHead(301, { Location: req.url + 'index.html' })
			res.end()
			return
		}

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
				serveFile(path.join(__dirname, 'view', '404.html'), 'text/html', res, emitter)
				break
		}
	}
})

server.listen(PORT, () => console.log(`Server running on port ${PORT}`))
