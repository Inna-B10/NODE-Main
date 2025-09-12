## Switching from CommonJS (require) to ES Modules (import):

1. **package.json:**  
   replace `"type": "commonjs",` with

```
	"type": "module",
	"sideEffects": false,
```

2. **Paths (\_\_dirname, \_\_filename)**  
   In ESM these globals don’t exist. Instead, build them using `import.meta.url`

```bash
# utils/path.js
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

export const __filename = fileURLToPath(import.meta.url)
export const __dirname = resolve(dirname(__filename), '..')
# '..' if structure -> root/utils
```

- Import with explicit extensions: `import { __dirname, __filename } from "./utils/path.js";`
- Common alternative:

```bash
import { join } from 'path'
const logsDir = join(process.cwd(), 'logs')
# process.cwd() always points to the project root
```

3. **Syntax**  
    Use import / export everywhere. Don’t mix require and import in the same project.
   <br />
   <br />
   <br />

# Webserver

1. **new files:**

<pre>
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

</pre>

2. **package.json:**  
   replace

```
"main": "index.js",
	"scripts": {
		"start": "node index",
		"dev": "nodemon"
	},
```

with

```
	"main": "server.js",
	"scripts": {
		"start": "node server",
		"dev": "nodemon server"
	},
```

3. **rename** index.js to server.js
4. **server.js:** delete

```
setTimeout(() => {
	emitter.emit('log', 'Something changed!', 'eventLog.txt')
}, 2000)
```

4. **server.js**: add

```
import path from 'path'
import http from 'http'
import { existsSync } from 'fs'
import * as fsPromises from 'fs/promises'
```
