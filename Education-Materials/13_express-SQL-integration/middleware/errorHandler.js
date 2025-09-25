import { logEvents } from './logEvents.js'

export const errorHandler = (err, req, res, next) => {
	logEvents(`${err.name}: ${err.message}`, 'errLog.txt')
	console.error(err.stack)
	res.status(500).send(err.message)
}
