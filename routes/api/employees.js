import * as empService from '#controllers/employeesController.js'
import { Router } from 'express'

export const employeesRouter = Router()

//# ------------------------------- All employees
// prettier-ignore
employeesRouter.route('/')
  .get(empService.getAllEmployees)
  .post(empService.createNewEmployee)
  .delete(empService.deleteAllEmployees)

//# ------------------------------- Single employee
// prettier-ignore
employeesRouter.route('/:id')
  .get(empService.getSingleEmployee)
  .put(empService.updateEmployee)
  .delete(empService.deleteSingleEmployee)
