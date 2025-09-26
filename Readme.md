# Express: Integrating SQL

<details>
<summary>used libraries:</summary>

```js
npm init -y
npm install date-fns, express, uuid
npm install nodemon -D
npm install nodemone -g
npm install cors
npm install better-sqlite3
```

</details>

<br />

👉 Download and install: **[DB Browser for SQLite](https://sqlitebrowser.org/dl/)**

## Step 1 - Creating DB

1. Create **database/database.js**:

```js
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

console.log('✅ The DB and table "employees" have been created!')
```

2. In the terminal run: `node database/database.js`.  
   It will create **database/companyEmployees.sqlite**

3. Open **DB Browser** program:

- tab **Open Database** -> select the newly created **companyEmployees.sqlite** from project.

<br />
<details>
<summary><h3  style="display:inline"><strong> 🔹 Step 1 - Alternative </strong></h3></summary>

1. Create **database/database.js**:

```js
import { rootDir } from '#utils/path.js'
import Database from 'better-sqlite3'
import path from 'path'

const dbPath = path.join(rootDir, 'database', 'companyEmployees.sqlite')

export function initDB() {
	const db = new Database(dbPath, { verbose: console.log })
	db.prepare(
		`
    CREATE TABLE IF NOT EXISTS employees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
			first_name TEXT NOT NULL,
			last_name TEXT NOT NULL,
			job_title TEXT NOT NULL
    )`
	).run()

	console.log('✅ The DB and table "employees" have been created!')
	return db
}
```

2. Update **server.js**

```js
import { initDB } from './database/database.js'

const db = initDB() //explicit function call
```

3. Start server.  
It will create **database/companyEmployees.sqlite** - DB and table structure.
</details>

<br />

## Step 2 - Migrations and seeding

1. Create **migrate.js**

```js
import { db } from './database/database.js'

db.prepare('DROP TABLE IF EXISTS employees').run()
db.prepare(
	`CREATE TABLE employees
  (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  job_title TEXT NOT NULL
  )`
).run()

console.log('Migration complete!')
```

2. Run: `node migrate.js`
3. Create **seed.js**: copy/paste code from **Liste av navn for databasen.docx**.  
   Change import to `import { db } from './database/database.js'`
4. Run: `node seed.js`
5. In **DB Browser** program: tab “Save project”, save in database folder

## Step 3 - CRUD operations

### **3.1 - Create**

1. Create **services/employeeServices.js**

```js
import { db } from '../database/database.js'

export function addEmployee({ first_name, last_name, job_title }) {
	const statement = db.prepare('INSERT INTO employee (first_name, last_name, job_title) VALUES (?, ?, ?)')
	return statement.run(first_name, last_name, job_title)
}
```

2. Create **controllers/employeesSqlController.js**

```js
import { addEmployee } from '../services/employeeServices.js'

export const handleAddEmployee = (req, res) => {
	const { first_name, last_name, job_title } = req.body

	if (!first_name || !last_name || !job_title) {
		return res.status(400).json({ error: 'All fields are required!' })
	}
	try {
		const result = addEmployee({ first_name, last_name, job_title })
		res.status(201).json({
			message: 'Employee added successfully',
			employee: {
				id: result.lastInsertRowid,
				first_name,
				last_name,
				job_title,
			},
		})
	} catch (err) {
		console.error('Database error:', err.message)
		res.status(500).json({ error: 'Failed to add new employee' })
	}
}
```

3. Update **routes/api/employees.js**:

   - add `import { handleAddEmployee } from '#controllers/employeesSqlController.js'`
   - add `employeesRouter.post('/addEmployee', handleAddEmployee)`

4. Test with **Thunder client**:
   - POST `http://localhost:3500/api/employees/addEmployee`
   - BODY `{"first_name":"Tony","last_name":"Stark", "job_title": "CEO"}`  
     It should add new row in DB (check in **DB Browser** program, refresh DB if needs)

### **3.2 - Read**

1. Update **services/employeeServices.js**: add

```js
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
```

2. Update **controllers/employeesSqlController.js**: add

```js
export const handleGetAllEmployees = (req, res) => {
	try {
		const employees = getAllEmployees()
		res.json(employees)
	} catch (err) {
		console.error('Database error: ', err.message)
		res.status(500).json({ error: 'Failed to fetch employees' })
	}
}

export const handleGetEmployeeById = (req, res) => {
	const { id } = req.params

	try {
		const employee = getEmployeeById(id)
		if (!employee) {
			return res.status(404).json({ error: 'Employee not found!' })
		}
		res.json(employee)
	} catch (err) {
		console.error('Database error: ', err.message)
		res.status(500).json({ error: 'Failed to fetch employee' })
	}
}
```

3. Update **routes/api/employees.js**: add and import

```js
employeesRouter.get('/', handleGetAllEmployees)
employeesRouter.get('/:id', handleGetEmployeeById)
```

4. Test with **Thunder client**:

- GET `http://localhost:3500/api/employees`
- GET `http://localhost:3500/api/employees/3`

### **3.3 - Update**

1. Update **services/employeeServices.js**: add

```js
//* ----------------------------- Update Employee ---------------------------- */
//prettier-ignore
export function updateEmployee(id, { first_name, last_name, job_title })
{
	const statement = db.prepare
  ('UPDATE employees SET first_name = ?, last_name = ?, job_title = ? WHERE id = ?')
	return statement.run(first_name, last_name, job_title, id)
}
```

2. Update **controllers/employeesSqlController.js**: add

```js
//* ----------------------------- Update Employee ---------------------------- */
export const handleUpdateEmployee = (req, res) => {
	const { id } = req.params
	const { first_name, last_name, job_title } = req.body

	if (!first_name || !last_name || !job_title) {
		return res.status(400).json({ error: 'All fields are required!' })
	}

	try {
		const result = updateEmployee(id, { first_name, last_name, job_title })

		if (result.changes === 0) {
			return res.status(404).json({ error: 'Employee not found' })
		}
		res.json({ message: 'Employee updated!' })
	} catch (err) {
		console.error('Database error: ', err.message)
		res.status(500).json({ error: 'Failed to update employee' })
	}
}
```

3. Update **routes/api/employees.js**: add and import  
   `employeesRouter.put('/:id', handleUpdateEmployee)`

4. Test with **Thunder client**:
   - PUT `http://localhost:3500/api/employees/51`
   - BODY `{"first_name":"Tony","last_name":"Stark", "job_title": "IT manager"}`

### 3.4 - Delete

1. Update **services/employeeServices.js**: add

```js
//* ----------------------------- Delete Employee ---------------------------- */
export function deleteEmployee(id) {
	const statement = db.prepare('DELETE FROM employees WHERE id = ?')
	return statement.run(id)
}
```

2. Update **controllers/employeesSqlController.js**: add

```js
//* ----------------------------- Delete Employee ---------------------------- */
export const handleDeleteEmployee = (req, res) => {
	const { id } = req.params
	try {
		const result = deleteEmployee(id)
		if (result.changes === 0) {
			return res.status(404).json({ error: 'Employee not found' })
		}
		res.json({ message: 'Employee deleted successfully' })
	} catch (err) {
		console.error('Database error: ', err.message)
		res.status(500).json({ error: 'Failed to delete employee' })
	}
}
```

3. Update **routes/api/employees.js**: add and import  
   `employeesRouter.delete('/:id', handleDeleteEmployee)`

4. Test with **Thunder client**:

- DELETE `http://localhost:3500/api/employees/51`

## Step 4 - Close connection

Update **server.js**: add import  
`import { db } from './database/database.js'`

add at the end

```js
//close connection
process.on(`SIGINT`, () => {
	try {
		db.close()
		console.log('Database connection closed')
	} catch (err) {
		console.error('Failed to close database connection', err.message)
	} finally {
		process.exit(0)
	}
})
```
