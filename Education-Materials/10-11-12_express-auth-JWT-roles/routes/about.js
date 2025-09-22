import { rootDir } from '#utils/path.js'
import { Router } from 'express'
import path from 'path'

export const aboutRouter = Router()

aboutRouter.get(['/', '/index', '/index.html'], (req, res) => {
	res.sendFile(path.join(rootDir, 'view', 'about', 'index.html'))
})
