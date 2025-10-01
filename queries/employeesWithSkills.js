import { db } from '../database/database.js'

export function getEmployeesWithSkills() {
	return db
		.prepare(
			`
      SELECT employees.first_name, employees.last_name, skills.name AS skill FROM employees
      INNER JOIN employee_skills ON employees.id = employee_skills.employee_id
      INNER JOIN skills ON employee_skills.skill_id = skills.id
      `
		)
		.all()
}
