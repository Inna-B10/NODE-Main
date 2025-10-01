import { db } from '../database/database.js'

export function getLatestProjects() {
	return db
		.prepare(
			`
      SELECT project_name, deadline FROM projects
      ORDER BY deadline DESC
      LIMIT 5
      `
		)
		.all()
}
