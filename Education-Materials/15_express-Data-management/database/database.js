import { rootDir } from '#utils/path.js'
import Database from 'better-sqlite3'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config()

const dbPath = path.join(rootDir, 'database', 'companyEmployees.sqlite')

// Verbose logging only in development
const isDev = process.env.NODE_ENV === 'development'

// Connect to the database (will create the companyEmployees.sqlite file if it doesn't exist)
export const db = new Database(dbPath, {
	verbose: isDev ? console.log : undefined,
})

// Enable foreign keys (important for SQLite!)
db.pragma('foreign_keys = ON')

//* --------------------------------- Tables --------------------------------- */
db.prepare(
	`CREATE TABLE IF NOT EXISTS employees
  (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    job_title TEXT NOT NULL
  )`
).run()

db.prepare(
	`CREATE TABLE IF NOT EXISTS projects
  (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id INTEGER NOT NULL,
    project_name TEXT NOT NULL,
    deadline TEXT,
    FOREIGN KEY (employee_id) REFERENCES employees(id)
  )`
).run()

db.prepare(
	`CREATE TABLE IF NOT EXISTS skills
    (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    )`
).run()

db.prepare(
	`CREATE TABLE IF NOT EXISTS employee_skills 
    (
      employee_id INTEGER NOT NULL,
      skill_id INTEGER NOT NULL,
      PRIMARY KEY (employee_id, skill_id),
      FOREIGN KEY (employee_id) REFERENCES employees(id),
      FOREIGN KEY (skill_id) REFERENCES skills(id)
    )`
).run()

//* --------------------------------- Indexes -------------------------------- */
// Index for projects by employee
db.prepare(
	`
CREATE INDEX IF NOT EXISTS idx_projects_employee_id
ON projects (employee_id)
`
).run()

// not really needed, since PRIMARY KEY (employee_id, skill_id) already covers employee_id

// Index for employee_skills by employee
// db.prepare(
// 	`
// CREATE INDEX IF NOT EXISTS idx_employee_skills_employee_id
// ON employee_skills (employee_id)
// `
// ).run()

// Index for project search by name (only if really needed!)
db.prepare(
	`
CREATE INDEX IF NOT EXISTS idx_projects_project_name
ON projects (project_name)
`
).run()

// UNIQUE: SQLite automatically creates an index for unique fields. This means this index duplicates the work.
// 👉 It can be removed; it's redundant.

// db.prepare(
// 	`
// CREATE INDEX IF NOT EXISTS idx_skills_name
// ON skills (name)
// `
// ).run()

// Index for employee_skills by skill (useful for queries like "who has skill X")
db.prepare(
	`CREATE INDEX IF NOT EXISTS idx_employee_skills_skill_id
   ON employee_skills (skill_id)`
).run()

isDev && console.log('The DB and tables have been created!')
