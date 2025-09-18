import { rootDir } from '#utils/path.js'
import bcrypt from 'bcrypt'
import fs from 'fs'
import path from 'path'

const usersDataPath = path.join(rootDir, 'model', 'users.json')
export const usersDB = {
	users: JSON.parse(fs.readFileSync(usersDataPath, 'utf-8')),
	setUsers(data) {
		this.users = data
	},
}

export const handleLogin = async (req, res) => {
	const { user, pwd } = req.body
	if (!user || !pwd) return res.status(400).json({ message: 'Username and password are required!' })

	const foundUser = usersDB.users.find(person => person.username === user)
	if (!foundUser) return res.sendStatus(401)

	const match = await bcrypt.compare(pwd, foundUser.password)
	if (match) {
		res.json({ message: `User ${user} logged in` })
	} else {
		res.sendStatus(401)
	}
}
