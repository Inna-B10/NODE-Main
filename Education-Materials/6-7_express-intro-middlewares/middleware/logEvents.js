import format from 'date-fns/format'
import { existsSync } from 'fs'
import * as fsPromises from 'fs/promises'
import { join } from 'path'
import { v4 as uuid } from 'uuid'
import { __dirname } from '../utils/path.js'

export async function logEvents(message, fileName) {
	const dateTime = `${format(new Date(), 'ddMMyyyy\tHH:mm:ss')}`
	const theLog = `${dateTime}\t${uuid()}\t${message}\n`
	// console.log(theLog)
	try {
		if (!existsSync(join(__dirname, '..', 'logs'))) {
			await fsPromises.mkdir(join(__dirname, '..', 'logs'))
		}
		await fsPromises.appendFile(join(__dirname, '..', 'logs', fileName), theLog)
	} catch (err) {
		console.error(err)
	}
}

export function logger(req, res, next) {
	logEvents(`${req.method}\t${req.header.origin}\t${req.url}`, 'reqLog.txt')
	console.log(req.method, req.path)
	next()
}
