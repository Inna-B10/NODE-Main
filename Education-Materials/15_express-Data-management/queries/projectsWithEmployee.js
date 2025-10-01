import { db } from '../database/database.js'

export function getProjectsWithEmployee() {
	return db
		.prepare(
			`
      SELECT projects.project_name, projects.deadline, employees.first_name, employees.last_name FROM projects INNER JOIN employees ON projects.employee_id = employees.id
      `
		)
		.all()
}
