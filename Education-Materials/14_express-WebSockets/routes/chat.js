import { rootDir } from '#utils/path.js'
import { Router } from 'express'
import path from 'path'

export const chatRouter = Router()

chatRouter.get('/', (req, res) => {
	res.sendFile(path.join(rootDir, 'view', 'chat.html'))
})
