import * as fsPromises from 'fs/promises'

//serve the file
export async function serveFile(filePath, contentType, response, emitter) {
	try {
		const rawData = await fsPromises.readFile(filePath, contentType.includes('image') ? '' : 'utf8')
		const data = contentType === 'application/json' ? JSON.parse(rawData) : rawData
		response.writeHead(filePath.includes('404.html') ? 404 : 200, { 'Content-Type': contentType })
		response.end(contentType === 'application/json' ? JSON.stringify(data) : data)
	} catch (err) {
		console.log(err)
		if (emitter) {
			emitter.emit('log', `${err.name}: ${err.message}`, 'errorLog.txt')
		}
		response.statusCode = 500
		response.end()
	}
}
