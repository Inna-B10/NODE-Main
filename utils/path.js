import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

//current file
export const __filename = fileURLToPath(import.meta.url)
export const __dirname = dirname(__filename)

// Absolute path to the project root
export const rootDir = resolve(dirname(__filename), '..')
