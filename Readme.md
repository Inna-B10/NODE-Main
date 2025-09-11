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

---
