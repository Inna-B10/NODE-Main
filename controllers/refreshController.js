// import 'dotenv/config'
import dotenv from 'dotenv'
dotenv.config()

import { rootDir } from '#utils/path.js'
import fs from 'fs'
import jwt from 'jsonwebtoken'
import path from 'path'

// Import path to locate the users.json file
const usersDataPath = path.join(rootDir, 'model', 'users.json')

// A simple in-memory "database" for users
// - Loads the JSON file into memory
// - Provides a setter to update users
export const usersDB = {
	users: JSON.parse(fs.readFileSync(usersDataPath, 'utf-8')),
	setUsers(data) {
		this.users = data
	},
}

// Controller function to handle issuing a new access token
export const handleRefreshToken = (req, res) => {
	// 1. Extract cookies from the request
	const cookies = req.cookies

	// 2. If no cookie named "jwt" exists, user is unauthorized
	if (!cookies?.jwt) return res.sendStatus(401)

	// 3. Extract refresh token from the cookie
	const refreshToken = cookies.jwt
	console.log('refreshToken:', refreshToken)

	// 4. Look for a user in DB that matches this refresh token
	const foundUser = usersDB.users.find(person => person.refreshToken === refreshToken)

	// 5. If no matching user found → Forbidden
	if (!foundUser) return res.sendStatus(403)

	// 6. Verify refresh token using REFRESH_TOKEN_SECRET
	jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
		// If verification fails OR username mismatch → Forbidden
		if (err || foundUser.username !== decoded.username) return res.sendStatus(403)

		// 8. Create a new short-lived access token
		//    - Includes username
		//    - Signed with ACCESS_TOKEN_SECRET
		//    - Expiration set to 30 seconds

		//prettier-ignore
		const accessToken = jwt.sign
		(
			{ username: decoded.username },
			process.env.ACCESS_TOKEN_SECRET, 
			{ expiresIn: '30s' }
		)

		// 9. Return the new access token as JSON
		res.json({ accessToken })
	})
}
