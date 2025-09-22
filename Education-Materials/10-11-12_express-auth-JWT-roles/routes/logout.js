import * as logoutController from '#controllers/logoutController.js'
import { Router } from 'express'

export const logoutRouter = Router()

logoutRouter.get('/', logoutController.handleLogout)
