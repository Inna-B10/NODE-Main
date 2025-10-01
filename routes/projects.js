import { Router } from 'express'
import { getLatestProjects } from '../queries/latestProjects.js'
import { getProjectsByEmployeeID } from '../queries/projectsByEmployeeID.js'
import { getProjectsWithEmployee } from '../queries/projectsWithEmployee.js'

export const projectsRouter = new Router()

projectsRouter.get('/active-projects', (req, res) => {
	const data = getProjectsWithEmployee()
	res.json(data)
})

projectsRouter.get('/by-employee/:id', (req, res) => {
	const employeeID = req.params.id
	const data = getProjectsByEmployeeID(employeeID)
	res.json(data)
})

projectsRouter.get('/latest', (req, res) => {
	const data = getLatestProjects()
	res.json(data)
})
