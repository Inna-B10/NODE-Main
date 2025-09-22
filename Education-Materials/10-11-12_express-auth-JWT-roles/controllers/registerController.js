import { rootDir } from '#utils/path.js'
import bcrypt from 'bcrypt'
import fs from 'fs'
import * as fsPromises from 'fs/promises'
import path from 'path'

const usersDataPath = path.join(rootDir, 'model', 'users.json')
export const usersDB = {
	users: JSON.parse(fs.readFileSync(usersDataPath, 'utf-8')),
	setUsers(data) {
		this.users = data
	},
}

export const handleNewUser = async (req, res) => {
	const { user, pwd } = req.body

	// Check: username and password must be provided
	if (!user || !pwd) return res.status(400).json({ message: 'Username and password are requires!' })

	// Check for duplicate username in the database
	const duplicate = usersDB.users.find(person => person.username === user)
	if (duplicate) return res.sendStatus(409)

	// Creating new user and Updating DB
	try {
		// Hash the password before storing
		const hashedPwd = await bcrypt.hash(pwd, 10)

		// Build new user object
		const newUser = { username: user, password: hashedPwd }

		// Update in-memory users list
		usersDB.setUsers([...usersDB.users, newUser])

		// Persist updated users list to the JSON file
		await fsPromises.writeFile(path.join(rootDir, 'model', 'users.json'), JSON.stringify(usersDB.users))
		console.log(usersDB.users)

		res.status(201).json({ success: `New user ${user} was created!` })
	} catch (err) {
		res.status(500).json({ message: err.message })
	}
}
