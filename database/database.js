import { rootDir } from '#utils/path.js'
import Database from 'better-sqlite3'
import path from 'path'

const dbPath = path.join(rootDir, 'database', 'companyEmployees.sqlite')

// Connect to the database (will create the companyEmployees.sqlite file if it doesn't exist)
export const db = new Database(dbPath, { verbose: console.log })

// Create a table if there isn't one
db.prepare(
	`CREATE TABLE IF NOT EXISTS employees
  (
    id  INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    job_title TEXT NOT NULL
  )`
).run()

console.log('The DB and table "employees" have been created!')
