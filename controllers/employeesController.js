import { rootDir } from '#utils/path.js'
import fs from 'fs'
import path from 'path'

const data = {}

const employeesPath = path.join(rootDir, 'model', 'employees.json')
data.employees = JSON.parse(fs.readFileSync(employeesPath, 'utf-8'))

//* ------------------------------ All Employees ----------------------------- */
export const getAllEmployees = (req, res) => {
	res.json(data.employees)
}

export const createNewEmployee = (req, res) => {
	res.json({
		firstName: req.body.firstName,
		lastName: req.body.lastName,
	})
}

export const deleteAllEmployees = (req, res) => {
	res.json({ message: 'This would delete all employees (dummy).' })
}

//* ----------------------------- Single Employee ---------------------------- */

export const getSingleEmployee = (req, res) => {
	res.json({
		id: req.params.id,
	})
}

export const updateEmployee = (req, res) => {
	res.json({
		id: req.params.id,
		firstName: req.body.firstName,
		lastName: req.body.lastName,
	})
}

export const deleteSingleEmployee = (req, res) => {
	res.json({ id: req.body.id })
}
