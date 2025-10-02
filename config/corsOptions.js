import { whitelist } from '#constants/whitelist.js'

export const corsOptions = {
	origin: (origin, callback) => {
		if (whitelist.indexOf(origin) !== -1 || !origin) callback(null, true)
		else callback(new Error('Blocked by CORS!'))
		console.log('origin: ', origin)
	},
	optionsSuccessStatus: 200,
}
