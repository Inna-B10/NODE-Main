# Express: Advanced data management

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

<details>
<summary><h2 style="display:inline"><strong>Part 1 - Relationships between tables</strong></h2></summary>

1. ### Update **database/database.js**:
   replace `console.log('The DB and table "employees" have been created!')` with

```js
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

console.log('The DB and tables have been created!')
```

2. ### Start the server

- New tables should be created. Check console output.

1. ### Open program **DB Browser for SQLite**:

- check if new tables `projects`, `skills` and `employee_skills` have been created
- tab **Execute SQL** --> execute:

```sql
INSERT INTO projects (employee_id, project_name, deadline)
VALUES (40, "Project Blue Book", "2025-09-01");
```

```sql
INSERT INTO projects (employee_id, project_name, deadline)
VALUES (40, "Project Bluebeam", "2025-09-01")
```

```sql
INSERT INTO skills (name) VALUES("Digging");
INSERT INTO skills (name) VALUES("Driving");
INSERT INTO skills (name) VALUES("Hairstyling");
INSERT INTO skills (name) VALUES("Receptionist");
INSERT INTO skills (name) VALUES("Fullstack developer");
INSERT INTO skills (name) VALUES("Customer support");
```

```sql
INSERT INTO employee_skills (employee_id, skill_id) VALUES (35, 5);
INSERT INTO employee_skills (employee_id, skill_id) VALUES (42, 6);
INSERT INTO employee_skills (employee_id, skill_id) VALUES (12, 3);
INSERT INTO employee_skills (employee_id, skill_id) VALUES (15, 1);
INSERT INTO employee_skills (employee_id, skill_id) VALUES (50, 4);
INSERT INTO employee_skills (employee_id, skill_id) VALUES (26, 2);
```

- tab **Browse Data** -> choose Table:

  - "projects" -> see records
  - "skills" -> see records
  - "employee_skills" -> see records

- save Project

4. ### Create **queries\projectsWithEmployee.js**:

```js
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
```

5. ### Create **routes/projects.js**

```js
import { Router } from 'express'
import { getProjectsWithEmployee } from '../queries/projectsWithEmployee.js'

export const projectsRouter = new Router()

projectsRouter.get('/active-projects', (req, res) => {
	const data = getProjectsWithEmployee()
	res.json(data)
})
```

6. ### Update **server.js**:

   after `app.use('/', rootRouter)` add `app.use("/projects", projectsRouter)` + import router

7. ### Open browser:
   `http://localhost:3500/projects/active-projects`

Result should be:

```
[
  {
    "project_name": "Project Blue Book",
    "deadline": "2025-09-01",
    "first_name": "Joshua",
    "last_name": "Walker"
  },
  {
    "project_name": "Project Bluebeam",
    "deadline": "2025-09-01",
    "first_name": "Joshua",
    "last_name": "Walker"
  }
]
```

</details>

<br />

<details>
<summary><h2 style="display:inline"><strong>Part 2 - Building relational API routes</strong></h2></summary>

<br />

1. ### Create **queries\employeesWithSkills.js**

```js
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
```

2. ### Create **queries\projectsByEmployeeID.js**

```js
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
```

3. ### Create **queries\skillsByEmployeeID.js**

```js
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
```

4. ### Create **queries\latestProjects.js**

```js
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
```

5. ### Create **routes\skills.js**

```js
import { Router } from 'express'
import { getEmployeesWithSkills } from '../queries/employeesWithSkills.js'
import { getSkillsByEmployeeID } from '../queries/skillsByEmployeeID.js'

export const skillsRouter = new Router()

skillsRouter.get('/', (req, res) => {
	const data = getEmployeesWithSkills()
	res.json(data)
})

skillsRouter.get('/employee/:id', (req, res) => {
	const employeeID = req.params.id
	const data = getSkillsByEmployeeID(employeeID)
	res.json(data)
})
```

6. ### Update **routes\projects.js**: add

```js
import { getLatestProjects } from '../queries/latestProjects.js'
import { getProjectsByEmployeeID } from '../queries/projectsByEmployeeID.js'

projectsRouter.get('/by-employee/:id', (req, res) => {
	const employeeID = req.params.id
	const data = getProjectsByEmployeeID(employeeID)
	res.json(data)
})

projectsRouter.get('/latest', (req, res) => {
	const data = getLatestProjects()
	res.json(data)
})
```

7. ### Update **server.js**

- attach router `app.use('/skills', skillsRouter)` + import

8. ### Open browser to test:

   - `http://localhost:3500/skills`
   - `http://localhost:3500/skills/employee/35`
   - `http://localhost:3500/projects/by-employee/40`
   - `http://localhost:3500/projects/latest`

</details>

<br />

<details>
<summary><h2 style="display:inline"><strong>Part 3 - Optimization, performance, indexes</strong></h2></summary>

<br />

### **🔷 Indexes:**

1. ### Update **database\database.js**:
   before `console.log` add

```js
//* --------------------------------- Indexes -------------------------------- */
db.prepare(
	`
CREATE INDEX IF NOT EXISTS idx_projects_employee_id
ON projects (employee_id)
`
).run()

db.prepare(
	`
CREATE INDEX IF NOT EXISTS idx_employee_skills_employee_id
ON employee_skills (employee_id)
`
).run()

db.prepare(
	`
CREATE INDEX IF NOT EXISTS idx_projects_project_name
ON projects (project_name)
`
).run()

db.prepare(
	`
CREATE INDEX IF NOT EXISTS idx_skills_name
ON skills (name)
`
).run()
```

2. ### Run the server
3. ### Open program **DB Browser for SQLite**:

- tab **Database Structure** --> **Indices**: 4 indexes should be created

4. ### Save the project

### **🔷 Filtering with `WHERE`:**

Using `WHERE` clauses reduces the amount of data processed by limiting rows at the earliest stage of query execution. Efficient filters can significantly improve performance, especially when combined with proper indexes. Poorly selective or non-indexed filters, however, can still cause full table scans.

- Purpose: Reduce the dataset early in query execution.
- Performance: Works best when the filter columns are indexed.

```sql
-- Fast if 'age' is indexed
SELECT *
FROM users
WHERE age > 30;
```

### **🔷 Limitation with `LIMIT`:**

The `LIMIT` clause restricts the number of rows returned, which reduces memory usage and network transfer. While it speeds up result delivery to the client, it does not optimize the underlying scan or filtering itself. To achieve the best performance, `LIMIT` is often used together with indexed filtering or sorting.

- Purpose: Restrict the number of rows returned to the client.
- Performance: Reduces transfer/memory, but doesn’t optimize the scan itself.

```sql
-- Returns only the first 10 rows
SELECT *
FROM products
ORDER BY created_at DESC
LIMIT 10;
```

</details>
