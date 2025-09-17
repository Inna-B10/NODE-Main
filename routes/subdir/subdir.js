import { rootDir } from '#utils/path.js'
import { Router } from 'express'
import path from 'path'

export const subdirRouter = Router()

subdirRouter.get(['/', '/index', '/index.html'], (req, res) => {
	res.sendFile(path.join(rootDir, 'view', 'subdir', 'index.html'))
})
