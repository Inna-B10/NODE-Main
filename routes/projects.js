import { Router } from 'express'
import { getProjectsWithEmployee } from '../queries/projectsWithEmployee.js'

export const projectsRouter = new Router()

projectsRouter.get('/active-projects', (req, res) => {
	const data = getProjectsWithEmployee()
	res.json(data)
})
