import { db } from '../database/database.js'

export function getProjectsByEmployeeID(employeeID) {
	return db
		.prepare(
			`
      SELECT project_name, deadline FROM projects
      WHERE employee_id = ?
      `
		)
		.all(employeeID)
}
