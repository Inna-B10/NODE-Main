import jwt from 'jsonwebtoken'

import dotenv from 'dotenv'
dotenv.config()

export const verifyJWT = (req, res, next) => {
	// Extract the "Authorization" header from the request
	const authHeader = req.headers.authorization || req.headers.Authorization

	// Log the raw Authorization header (e.g. "Bearer eyJhbGciOiJIUzI1NiIs...")
	console.log('authHeader:', authHeader)

	// If no Bearer Authorization header is present, the client is not authenticated → 401 Unauthorized
	if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401)

	// Split the header: "Bearer <token>" → take only the token part
	const token = authHeader.split(' ')[1]

	// Verify the token with the secret key
	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
		// If verification fails (expired, invalid, or tampered token) → 403 Forbidden
		if (err) {
			console.log(err.message)
			return res.sendStatus(403)
		}

		// If valid, attach the decoded username and roles to the request object
		// so other middleware/routes can know which user is making the request and if this user authorized to do it
		req.user = decoded.UserInfo.username
		req.roles = decoded.UserInfo.roles

		// Call the next middleware or route handler
		next()
	})
}
