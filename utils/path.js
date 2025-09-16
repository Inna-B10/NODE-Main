import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

export const __filename = fileURLToPath(import.meta.url)
export const __dirname = resolve(dirname(__filename), '..')

// const logsDir = join(process.cwd(), 'logs')
// process.cwd() always get root of the project and more common to use.
