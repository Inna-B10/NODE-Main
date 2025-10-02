import { logEvents } from './logEvents.js'

export const errorHandler = (err, req, res, next) => {
	logEvents(`${err.name}: ${err.message}`, 'errLog.txt')

	if (process.env.NODE_ENV === 'development') {
		console.error(err.stack)
		res.status(500).send(err.message)
	} else {
		res.status(500).send('Internal Server Error')
	}
}
