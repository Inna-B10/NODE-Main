import { rootDir } from '#utils/path.js'
import format from 'date-fns/format'
import { existsSync } from 'fs'
import * as fsPromises from 'fs/promises'
import { join } from 'path'
import { v4 as uuid } from 'uuid'

export async function logEvents(message, fileName) {
	const dateTime = `${format(new Date(), 'ddMMyyyy\tHH:mm:ss')}`
	const theLog = `${dateTime}\t${uuid()}\t${message}\n`
	// console.log(theLog)
	try {
		if (!existsSync(join(rootDir, 'logs'))) {
			await fsPromises.mkdir(join(rootDir, 'logs'))
		}
		await fsPromises.appendFile(join(rootDir, 'logs', fileName), theLog)
	} catch (err) {
		console.error(err)
	}
}

export function logger(req, res, next) {
	logEvents(`${req.method}\t${req.header.origin}\t${req.url}`, 'reqLog.txt')
	console.log(req.method, req.path)
	next()
}
