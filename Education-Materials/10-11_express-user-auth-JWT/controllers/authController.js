// import 'dotenv/config'
import dotenv from 'dotenv'
dotenv.config()

import { rootDir } from '#utils/path.js'
import bcrypt from 'bcrypt'
import fs from 'fs'
import * as fsPromises from 'fs/promises'
import jwt from 'jsonwebtoken'
import path from 'path'

const usersDataPath = path.join(rootDir, 'model', 'users.json')

export const usersDB = {
	users: JSON.parse(fs.readFileSync(usersDataPath, 'utf-8')),
	setUsers(data) {
		this.users = data
	},
}

//prettier-ignore
export const handleLogin = async (req, res) => {
	// Extract username and password from the request body
	const { user, pwd } = req.body

	// Check: both username and password must be provided
	if (!user || !pwd) return res.status(400).json({ message: 'Username and password are required!' })

	// Look for the user in the "usersDB" database
	const foundUser = usersDB.users.find(person => person.username === user)

	// If user is not found, return 401 Unauthorized
	if (!foundUser) return res.sendStatus(401)

	// Compare provided password with stored hashed password using bcrypt
	const match = await bcrypt.compare(pwd, foundUser.password)
	
	if (match) {
		// If password matches, create JWT access and refresh tokens
		const accessToken = jwt.sign(
			{ username: foundUser.username },
			process.env.ACCESS_TOKEN_SECRET,
			{ expiresIn: '30s' } // access token expires in 30 seconds
		)
		const refreshToken = jwt.sign(
			{ username: foundUser.username },
			process.env.REFRESH_TOKEN_SECRET,
			{ expiresIn: '1d' } // refresh token expires in 1 day
		)

		// Update the user database with the refresh token
		const otherUsers = usersDB.users.filter(person => person.username !== foundUser.username)
		const currentUser = { ...foundUser, refreshToken } // add refreshToken to current user
		usersDB.setUsers([...otherUsers, currentUser]) // save updated users list

		// Set the refresh token as an HTTP-only cookie
		res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 })

		// Respond to client with the access token
		res.json({ accessToken }) // this accessToken then usually passed to Authorization: Bearer <token>

		// Persist the updated users database to a JSON file
		await fsPromises.writeFile(path.join(rootDir, 'model', 'users.json'), JSON.stringify(usersDB.users))
	} else {

		// If password doesn't match, return 401 Unauthorized
		res.sendStatus(401)
	}
}
