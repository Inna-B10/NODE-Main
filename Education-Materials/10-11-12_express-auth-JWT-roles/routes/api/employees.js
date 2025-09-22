import { ROLES_LIST } from '#constants/roles-list.js'
import * as empService from '#controllers/employeesController.js'
import { verifyRoles } from '#middleware/verifyRoles.js'
import { Router } from 'express'

export const employeesRouter = Router()

//# ------------------------------- All employees
employeesRouter
	.route('/')
	.get(empService.getAllEmployees)
	.post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), empService.createNewEmployee)
	.delete(verifyRoles(ROLES_LIST.Admin), empService.deleteAllEmployees)

//# ------------------------------- Single employee
employeesRouter
	.route('/:id')
	.get(empService.getSingleEmployee)
	.put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), empService.updateEmployee)
	.delete(verifyRoles(ROLES_LIST.Admin), empService.deleteSingleEmployee)
