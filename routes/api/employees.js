import { rootDir } from '#utils/path.js'
import { Router } from 'express'
import fs from 'fs'
import path from 'path'

export const employeesRouter = Router()

const data = {}

const employeesPath = path.join(rootDir, 'data', 'employees.json')

// Read JSON dynamically
data.employees = JSON.parse(fs.readFileSync(employeesPath, 'utf-8'))
console.log(data.employees)

employeesRouter
	.route('/')
	.get((req, res) => {
		res.json(data.employees)
	})
	.post((req, res) => {
		res.json({
			firstName: req.body.firstName,
			lastName: req.body.lastName,
		})
	})
	.put((req, res) => {
		res.json({
			firstName: req.body.firstName,
			lastName: req.body.lastName,
		})
	})
	.delete((req, res) => {
		res.json({ id: req.body.id })
	})
