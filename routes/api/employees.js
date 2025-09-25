import * as empService from '#controllers/employeesController.js'
import { handleAddEmployee, handleDeleteEmployee, handleGetAllEmployees, handleGetEmployeeById, handleUpdateEmployee } from '#controllers/employeesSqlController.js'
import { Router } from 'express'

export const employeesRouter = Router()

employeesRouter.post('/addEmployee', handleAddEmployee)
employeesRouter.get('/', handleGetAllEmployees)
employeesRouter.get('/:id', handleGetEmployeeById)
employeesRouter.put('/:id', handleUpdateEmployee)
employeesRouter.delete('/:id', handleDeleteEmployee)

//# ------------------------------- All employees
//prettier-ignore
employeesRouter
	.route('/')
	.get(empService.getAllEmployees)
	.post(empService.createNewEmployee)
	.delete(empService.deleteAllEmployees)

//# ------------------------------- Single employee
//prettier-ignore
employeesRouter
	.route('/:id')
	.get(empService.getSingleEmployee)
	.put(empService.updateEmployee)
	.delete(empService.deleteSingleEmployee)
