import { db } from '../database/database.js'

export function getSkillsByEmployeeID(employeeID) {
	return db
		.prepare(
			`
      SELECT skills.name as skill FROM employee_skills
      INNER JOIN skills ON employee_skills. skill_id = skills.id
      WHERE employee_skills.employee_id = ?
      `
		)
		.all(employeeID)
}
