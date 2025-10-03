import { Router } from 'express'
import { getEmployeesWithSkills } from '../queries/employeesWithSkills.js'
import { getSkillsByEmployeeID } from '../queries/skillsByEmployeeID.js'

export const skillsRouter = new Router()

skillsRouter.get('/', (req, res) => {
	const data = getEmployeesWithSkills()
	res.json(data)
})

skillsRouter.get('/employee/:id', (req, res) => {
	const employeeID = req.params.id
	const data = getSkillsByEmployeeID(employeeID)
	res.json(data)
})
