import * as authController from '#controllers/authController.js'
import { Router } from 'express'

export const authRouter = Router()

authRouter.post('/', authController.handleLogin)
