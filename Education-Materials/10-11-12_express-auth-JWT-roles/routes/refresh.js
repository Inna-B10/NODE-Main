import * as refreshController from '#controllers/refreshController.js'
import { Router } from 'express'

export const refreshRouter = Router()

refreshRouter.get('/', refreshController.handleRefreshToken)
