import * as regController from '#controllers/registerController.js'
import { Router } from 'express'

export const registerRouter = Router()

registerRouter.post('/', regController.handleNewUser)
