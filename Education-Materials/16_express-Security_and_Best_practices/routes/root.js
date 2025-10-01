import { rootDir } from '#utils/path.js'
import { Router } from 'express'
import path from 'path'

export const rootRouter = Router()

rootRouter.get(['/', '/index', '/index.html'], (req, res) => {
	res.sendFile(path.join(rootDir, 'view', 'index.html'))
})

rootRouter.get('/404{.:html}', (req, res) => {
	res.sendFile(path.join(rootDir, 'view', '404.html'))
})
