import { db } from '../database/database.js'

//* ---------------------------- Add New Employee ---------------------------- */
//prettier-ignore
export function addEmployee({ first_name, last_name, job_title })
{
	const statement = db.prepare
  ('INSERT INTO employees (first_name, last_name, job_title) VALUES (?, ?, ?)')
  return statement.run(first_name, last_name, job_title)
}

//* ---------------------------- Get All Employees --------------------------- */
export function getAllEmployees() {
	const statement = db.prepare('SELECT * FROM employees')
	return statement.all()
}

//* --------------------------- Get Employee By Id --------------------------- */
export function getEmployeeById(id) {
	const statement = db.prepare('SELECT * FROM employees WHERE id = ?')
	return statement.get(id)
}

//* ----------------------------- Update Employee ---------------------------- */
//prettier-ignore
export function updateEmployee(id, { first_name, last_name, job_title })
{
	const statement = db.prepare
  ('UPDATE employees SET first_name = ?, last_name = ?, job_title = ? WHERE id = ?')
	return statement.run(first_name, last_name, job_title, id)
}

//* ----------------------------- Delete Employee ---------------------------- */
export function deleteEmployee(id) {
	const statement = db.prepare('DELETE FROM employees WHERE id = ?')
	return statement.run(id)
}
