import { __dirname } from './utils/path.js'

import format from 'date-fns/format'
import fs from 'fs'
import * as fsPromises from 'fs/promises'
import path from 'path'
import { v4 as uuid } from 'uuid'

const logEvents = async message => {
	const dateTime = `${format(new Date(), 'ddMMyyyy\tHH:mm:ss')}`
	const theLog = `${dateTime}\t${uuid()}\t${message}\n`
	console.log(theLog)
	try {
		if (!fs.existsSync(path.join(__dirname, 'logs'))) {
			await fsPromises.mkdir(path.join(__dirname, 'logs'))
		}
		await fsPromises.appendFile(
			path.join(__dirname, 'logs', 'eventLog.txt'),
			theLog
		)
	} catch (err) {
		console.error(err)
	}
}

export default logEvents
