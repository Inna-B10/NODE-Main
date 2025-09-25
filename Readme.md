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
