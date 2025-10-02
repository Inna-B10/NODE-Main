# Express: Routes and MVC

```js
npm init -y
npm install date-fns, express, uuid
npm install nodemon -D
npm install nodemon -g
npm install cors
```

## Routes + subRoutes

**Example structure**

```
project/
├─ routes/
│  ├─ about.js        // Handles /about
│  ├─ subdir.js       // Handles /subdir/*
│  └─ admin.js        // Handles /admin/*
├─ view/
│  ├─ index.html      // /
│  ├─ about/index.html
│  ├─ subdir/index.html
│  ├─ subdir/contact.html
│  └─ admin/dashboard.html
└─ server.js          // Main app setup
```

**In server.js**

```js
// Import routers
import aboutRouter from './routes/about.js'
import subdirRouter from './routes/subdir.js'
import adminRouter from './routes/admin.js'

// Attach routers
app.use('/about', aboutRouter) // all /about pages
app.use('/subdir', subdirRouter) // all /subdir pages
app.use('/admin', adminRouter) // all /admin pages

// Root page
app.get('/', (req, res) => {
	res.sendFile(path.join(root, 'view', 'index.html'))
})
```

**What the browser sees**

```
/              → view/index.html
/about         → view/about/index.html
/subdir/       → view/subdir/index.html
/subdir/contact→ view/subdir/contact.html
/admin/        → view/admin/dashboard.html
```

### Key point

- **Routers** are just a way to organize code.

- **The site** is still one application, one domain, one server.

- Splitting with `Router()` makes sense when you have sections (like `/admin`, `/user`, `/shop`).

### **Is it needed to create a subfolder for each subRoute?**

It's possible to keep all route files together in `project/routes/`, like:

```
routes/
 ├─ about.js
 ├─ subdir.js
 ├─ admin.js
 └─ user.js
```

Each file contains its own `Router()` or `app.get()` handlers. This is clean and simple for **small to medium projects**.

### _**When you might want to create subFolders?**_

1. **Many routes per section**  
   Example: `/admin` has **/dashboard**, **/users**, **/settings**

```
routes/admin/
          ├─ dashboard.js
          ├─ users.js
          └─ settings.js
```

Each sub-file handles a subset of `/admin/*`. The main **routes/admin/index.js** imports them and attaches to the **/admin** router.

2. **Shared middleware per section**  
   If **/shop/\*** routes need authentication or logging specific to the shop, a dedicated folder makes it easy to apply middleware to the entire section.

3. **Scaling / team collaboration**  
   When multiple developers work on different sections, folders help prevent merge conflicts and keep things organized.

## **MVC** (Model-View-Controller)

1. Rename **data/** to **model/**
2. Move all methods from routes\api\employees.js to controllers\employeesController.js (see **API route with CRUD methods** section)
3. Import them to **routes\api\employees.js:**

```js
import * as empService from '#controllers/employeesController.js'
//# ------------------------------- All employees
// prettier-ignore
employeesRouter.route('/')
  .get(empService.getAllEmployees)
  .post(empService.createNewEmployee)
  .delete(empService.deleteAllEmployees)

//# ------------------------------- Single employee
// prettier-ignore
employeesRouter.route('/:id')
  .get(empService.getSingleEmployee)
  .put(empService.updateEmployee)
  .delete(empService.deleteSingleEmployee)
```

4. Move this code from **server.js** to new file **config\corsOptions.js**

```js
const whitelist = ['https://www.this-site-is-allowed.com', 'http://127.0.0.1:5500', 'http://localhost:3500']
export const corsOptions = {
	origin: (origin, callback) => {
		if (whitelist.indexOf(origin) !== -1 || !origin) callback(null, true)
		else callback(new Error('Blocked by CORS!'))
		console.log('origin: ', origin)
	},
	optionsSuccessStatus: 200,
}
```

5. Import it to **server.js**

`import { corsOptions } from './config/corsOptions.js'`

6. Update **package.json**:

```json
	"imports": {
		"#utils/*": "./utils/*",
		"#routes/*": "./routes/*",
		"#middleware/*": "./middleware/*",
		"#controllers/*": "./controllers/*",
		"#constants/*": "./constants/*",
		"#config/*": "./config/*"
	},
```

<br />

## API route with CRUD methods (analysis)

Right now it's purely **"virtual"** operations in memory, **not** working with a file.

- We read **employees.json** once when the server starts and store the data in **data.employees**.

- Any changes we make through methods (`createNewEmployee`, `deleteAllEmployees`, etc.) only change the in-memory object (**data.employees**) and are **not** written back to the file.

```js
const data = {}

const employeesPath = path.join(rootDir, 'model', 'employees.json')
data.employees = JSON.parse(fs.readFileSync(employeesPath, 'utf-8'))

//* ------------------------------ All Employees ----------------------------- */
export const getAllEmployees = (req, res) => {
	res.json(data.employees)
}

export const createNewEmployee = (req, res) => {
	res.json({
		firstName: req.body.firstName,
		lastName: req.body.lastName,
	})
}

export const deleteAllEmployees = (req, res) => {
	res.json({ message: 'This would delete all employees (dummy).' })
}

//* ----------------------------- Single Employee ---------------------------- */

export const getSingleEmployee = (req, res) => {
	res.json({
		id: req.params.id,
	})
}

export const updateEmployee = (req, res) => {
	res.json({
		id: req.params.id,
		firstName: req.body.firstName,
		lastName: req.body.lastName,
	})
}

export const deleteSingleEmployee = (req, res) => {
	res.json({ id: req.body.id })
}
```

### 🌐 All Employees

- `getAllEmployees`  
  Returns the full list of employees from memory (`data.employees`).  
  ⚠️ Important: this is just the data loaded once from **employees.json** when the server started.

- `createNewEmployee`  
  Takes **firstName** and **lastName** from the request body and returns them in JSON.  
  ⚠️ It does **not** actually add the employee to memory or save it to the file. It’s a **"virtual"** response only.

- `deleteAllEmployees`  
   Always responds with a success message:
  `{ "message": "This would delete all employees (dummy)." }`  
  ⚠️ It does **not** delete anything — this is just a placeholder ("dummy") implementation.

### 👤 Single Employee

- `getSingleEmployee`  
  Returns an object containing the **id** from the request URL (`req.params.id`).  
  ⚠️ It does not check if that ID exists in **employees.json**.

- `updateEmployee`  
  Returns **firstName** and **lastName** from the request body.  
  ⚠️ It does not update the actual employee data in memory or the file.

- `deleteSingleEmployee`  
  Returns an object containing the **id** from the request body (`req.body.id`).  
  ⚠️ It does not delete anything from memory or the file.

### **📝 Summary**

Right now, **all of these methods are "virtual"**:

- They only read data from memory once at server startup.
- None of them actually update or delete the employees.json file.
- Responses are more like **mock data** or placeholders for testing routes with Thunder Client/Postman.
