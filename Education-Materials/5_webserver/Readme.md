## Switching from CommonJS (require) to ES Modules (import):

**Reason to do it** read here: [Tree-shaking.md](Tree-shaking.md) - (google translate to Norwegian)

1. **package.json:**  
   replace `"type": "commonjs",` with

```js
	"type": "module",
	"sideEffects": false,
```

2. **Paths (\_\_dirname, \_\_filename)**  
   In ESM these globals don’t exist. Instead, build them using `import.meta.url`

```js
// utils/path.js
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

export const __filename = fileURLToPath(import.meta.url)
export const __dirname = resolve(dirname(__filename), '..')
// '..' if structure -> root/utils
```

- Import with explicit extensions: `import { __dirname, __filename } from "./utils/path.js";`
- Common alternative:

```js
import { join } from 'path'
const logsDir = join(process.cwd(), 'logs')
// process.cwd() always points to the project root
```

3. **Syntax**  
   Use import / export everywhere. Don’t mix require and import in the same project.

---

---

<br />
<br />

# Webserver

### step 1:

1. **new files:**
   - add new files from the archive **step1**
   - check if **utils/path.js** from previous exists

<pre>
📂root
┣ 📂css
┃ ┗ 📜stylesheet.css
┣ 📂data
┃ ┣ 📜data.json
┃ ┗ 📜data.txt
┣ 📂img
┃ ┗ 📜bg.png
┣ 📂view
┃ ┣ 📂about
┃ ┃ ┗ 📜index.html
┃ ┣ 📜404.html
┃ ┣ 📜index.html
┃ ┗ 📜new-page.html
┗ 📜server.js
</pre>

2. **package.json:**
   replace

```json
"main": "index.js",
"scripts": {
"start": "node index",
"dev": "nodemon"
},
```

with

```json
    "main": "server.js",
    "scripts": {
    	"start": "node server",
    	"dev": "nodemon server"
    },
```

3. **delete** index.js
4. run **npm run dev**

---

---

<br />
<br />

## **Path alias (optional):**

- create new file **serveFile.js** in the folder utils:

```js
import * as fsPromises from 'fs/promises'

//serve the file
export async function serveFile(filePath, contentType, response, emitter) {
	try {
		const rawData = await fsPromises.readFile(filePath, contentType.includes('image') ? '' : 'utf8')
		const data = contentType === 'application/json' ? JSON.parse(rawData) : rawData
		response.writeHead(filePath.includes('404.html') ? 404 : 200, { 'Content-Type': contentType })
		response.end(contentType === 'application/json' ? JSON.stringify(data) : data)
	} catch (err) {
		console.log(err)
		if (emitter) {
			emitter.emit('log', `${err.name}: ${err.message}`, 'errorLog.txt')
		}
		response.statusCode = 500
		response.end()
	}
}
```

- **server.js:** delete function

```js
//serve the file
const serveFile = async (filepath, contentType, response) => {
...
}
```

## **How to import?**

Node doesn't give `"@/*"` directly: `"./*"` like React or Next.js.

### Method 1:

`@/*` is not allowed at all, but `#utils/*` is OK

_**NB! `"#/*": "./*"` doesn't work!** Only subfolders._

1. **package.json**: add

```js
	"imports": {
		"#utils/*": "./utils/*"
	},
```

2. **server.js:** add

```js
import { __dirname } from '#utils/path.js'
import { serveFile } from '#utils/serveFile.js'
```

<br />

### Method 2: only for CommonJS

<details>
<summary> not tested!</summary>

1. **npm install module-alias --save**
2. **package.json:** add

```js
  "_moduleAliases": {
		"@": "./",
		"@utils": "./utils"
  },
```

3. using alias: in the very first file **before** all imports add

```js
require('module-alias/register')
```

no need to paste into each file.
`module-alias/register` patches the global module resolver once for the entire lifetime of the Node.js process.

After that, any of import '@utils/...' will work in any file in the project.

So it's enough to include it **once in the very first file (e.g. server.js or bootstrap.js)**, the main thing is that it is executed before the first use of the alias.

4. example imports: **server.js**

```js
require('module-alias/register')
const serveFile = require('@utils/serveFile.js')
```

### **NB! IMPORTANT**

if the import order changes automatically on saving:

#### alternative1: change VS Code settings:

```json
"typescript.preferences.importModuleSpecifier": "non-relative",
"editor.codeActionsOnSave": {
  "source.organizeImports": false
}
```

#### alternative2:

- **for CommonJs:** in package.json

```json
"scripts": {
    "dev": "node --require module-alias/register server.js"
  }
```

</details>

<br />
