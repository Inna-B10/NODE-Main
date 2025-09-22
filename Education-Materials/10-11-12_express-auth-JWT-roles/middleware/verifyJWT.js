import jwt from 'jsonwebtoken'

import dotenv from 'dotenv'
dotenv.config()

export const verifyJWT = (req, res, next) => {
	// Extract the "Authorization" header from the request
	const authHeader = req.headers['authorization']

	// If no Authorization header is present, the client is not authenticated → 401 Unauthorized
	if (!authHeader) return res.sendStatus(401)

	// Log the raw Authorization header (e.g. "Bearer eyJhbGciOiJIUzI1NiIs...")
	console.log(authHeader)

	// Split the header: "Bearer <token>" → take only the token part
	const token = authHeader.split(' ')[1]

	// Verify the token with the secret key
	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
		// If verification fails (expired, invalid, or tampered token) → 403 Forbidden
		if (err) return res.sendStatus(403)

		// If valid, attach the decoded username to the request object
		// so other middleware/routes can know which user is making the request
		req.user = decoded.username

		// Call the next middleware or route handler
		next()
	})
}
