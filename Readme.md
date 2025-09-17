# Express: Routes and MVC

```js
npm init -y
npm install date-fns, express, uuid
npm install nodemon -D
npm install nodemone -g
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

<br />

### When you might want to create subFolders?

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
