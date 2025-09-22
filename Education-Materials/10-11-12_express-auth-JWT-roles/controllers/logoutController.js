// import 'dotenv/config'
import dotenv from 'dotenv'
dotenv.config()

import { rootDir } from '#utils/path.js'
import fs from 'fs'
import * as fsPromises from 'fs/promises'
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

export const handleLogout = async (req, res) => {
	// 1. Extract cookies from the request
	const cookies = req.cookies

	// 2. If no cookie named "jwt" exists, user is unauthorized
	if (!cookies?.jwt) return res.sendStatus(401)

	// 3. Extract refresh token from the cookie
	const refreshToken = cookies.jwt

	// 4. Check if a user exists in DB with this refresh token
	const foundUser = usersDB.users.find(person => person.refreshToken === refreshToken)

	// 5. If no user is found:
	//    - Clear the cookie on the client side
	//    - Respond with "204 No Content"
	if (!foundUser) {
		res.clearCookie('jwt', { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 })
		return res.sendStatus(204)
	}

	// 6. Remove the refresh token from the found user
	//    and keep all other users intact
	const otherUsers = usersDB.users.filter(person => person.refreshToken !== refreshToken)
	const currentUser = { ...foundUser, refreshToken: '' }

	// 7. Save updated user list back into memory
	usersDB.setUsers([...otherUsers, currentUser])

	// 8. Persist updated users data into users.json file
	await fsPromises.writeFile(path.join(rootDir, 'model', 'users.json'), JSON.stringify(usersDB.users))

	// 9. Clear cookie on client side
	//    - httpOnly prevents JS access
	//    - maxAge is short, ensures removal
	res.clearCookie('jwt', { httpOnly: true, maxAge: 24 * 60 * 60 * 100 })

	// 10. Respond with "204 No Content" (success, no body needed)
	res.sendStatus(204)
}
