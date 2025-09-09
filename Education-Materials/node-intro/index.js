// **********************************************************************************************************************
// These 3 utilities are used throughout the file.
// Do not comment them out.
// **********************************************************************************************************************
/* ------------------------------ Processing Errors */
process.on('uncaughtException', (err, origin) => {
	fs.writeSync(process.stderr.fd, `${BOLD}Caught exception: ${err}\n` + `Exception origin: ${origin}\n${RESET}`)
})

/* ------------------------------ Colors in Terminal */
const COLORS = {
	RESET: '\x1b[0m',
	BOLD: '\x1B[1m',
	BLUE: '\x1B[38;5;27m',
	ORANGE: '\x1B[38;5;202m',
}

/* ------------------------------- Check if File Exists */
async function checkFileExistsSync(filePath) {
	if (fs.existsSync(filePath)) {
		console.log(COLORS.BLUE + 'File greeting.txt exists!' + COLORS.RESET)
		return true
	} else {
		console.log(COLORS.BLUE + 'File greeting.txt does not exist.' + COLORS.RESET)
		return false
	}
}
//************************************************* IMPORTANT! ********************************************************* */

// Uncomment the code blocks below to test different Node.js core modules and functionalities

// You can uncomment only ONE block at a time to avoid conflicts

// Remember to save file/changes EVERY time before running the code!

// Run in the terminal:
// node index.js - to run the code
// clear - to clear the terminal

// ********************************************************************************************************************* */

/*//* ----------------------------- Part 1 — Paths ----------------------------- */
//# Check special variables __dirname and __filename (current folder and absolute file path).

// console.log(COLORS.BOLD + 'current directory:' + COLORS.RESET, __dirname)
// console.log(COLORS.BOLD + 'current file:' + COLORS.RESET, __filename)

/*//* --------------------------- Part 2 — OS Module --------------------------- */
//# Retrieve basic operating system info: type, platform, and home directory.

//NB IMPORTANT: You can use either require('packageName') or import ... from 'packageName', but you cannot mix `require` and `import`! You should stick to one method consistently throughout the project.

// const os = require('os') // works also with: import os from 'os'
// console.log(COLORS.BOLD + 'OS type:' + COLORS.RESET, os.type())
// console.log(COLORS.BOLD + 'OS platform:' + COLORS.RESET, os.platform())
// console.log(COLORS.BOLD + 'OS home directory:' + COLORS.RESET, os.homedir())

/*//* -------------------------- Part 3 — Path Module -------------------------- */
//# Parse the current file path into components (root, dir, base, ext, name).

// const path = require('path') // works also with: import path from 'path'
// const pathObj = path.parse(__filename)
// console.log(pathObj)

/*//* ----------------------- Part 4 — File System (sync) ---------------------- */
//#Read the list of files in the current directory synchronously and log them.

// const fs = require('fs') // import fs from 'fs'
// const files = fs.readdirSync('.')
// console.log(COLORS.BLUE + COLORS.BOLD + 'list of files in current directory:' + COLORS.RESET, files)
// console.log(COLORS.ORANGE + 'listing files one by one:')
// for (const file of files) {
// 	console.log(file)
// }
// console.log(COLORS.RESET) //to reset the colors in terminal

/*//* -------------------------- Part 5 — HTTP Server -------------------------- */
//# Start a simple web server that responds with “Hello World!” in the browser.

//NB IMPORTANT: Press ctrl+c in the terminal to stop server

// const http = require('http') //import http from 'http'
// http
// 	.createServer((req, res) => {
// 		res.writeHead(200, { 'Content-Type': 'text/html' })
// 		res.write('<h1>Hello World!</h1>')
// 		res.end()
// 	})
// 	.listen(8080, () => {
// 		console.log(COLORS.ORANGE + 'Your server running at http://localhost:8080/\nPress ctrl+c in the terminal to stop server' + COLORS.RESET)
// 	})

/*//* ------------------ Part 6 — File Read (async Callbacks) ------------------ */
//# Read the content of starter.txt in binary (Buffer/HEX) and in text (UTF-8).

// const fs = require('fs') // import fs from 'fs'
//
// /* ------------------------------ In HEX Format */
// fs.readFile('./starter.txt', (err, data) => {
// 	if (err) {
// 		throw err
// 	} else {
// 		console.log(COLORS.ORANGE + 'Content of starter.txt in HEX:' + COLORS.RESET, data)
// 	}
// })
//
// /* ----------------------------- In UTF8 Format */
// fs.readFile('./starter.txt', 'utf8', (err, data) => {
// 	if (err) {
// 		throw err
// 	} else {
// 		console.log(COLORS.ORANGE + 'Content of starter.txt in UTF8:' + COLORS.RESET, data)
// 	}
// })

/*//* -------------- Part 7 — File & Directory (nested Callbacks) -------------- */
//#  Create a directory and a file, write text to it, then read it and list files in the folder.

// const fs = require('fs')
// const path = require('path')
//
// /* ---------------------------- Create Directory ---------------------------- */
// fs.mkdir(path.join(__dirname, 'child-dir'), { recursive: true }, err => {
// 	if (err) throw err
// 	else {
// 		console.log(COLORS.ORANGE + 'Directory created successfully!' + COLORS.RESET)
//
// 		/* ----------------------- Create File And Write To It ---------------------- */
// 		//NB IMPORTANT: if file already exists, its content will be overwritten!
//
// 		fs.writeFile(path.join(__dirname, 'child-dir', 'greeting.txt'), 'Hi there, hello!', err => {
// 			if (err) {
// 				throw err
// 			} else {
// 				console.log(COLORS.ORANGE + 'Created greeting.txt successfully!' + COLORS.RESET)
//
// 				/* -------------------------------- Read File ------------------------------- */
// 				fs.readFile(path.join(__dirname, 'child-dir', 'greeting.txt'), 'utf8', (err, data) => {
// 					if (err) {
// 						throw err
// 					} else {
// 						console.log(COLORS.ORANGE + 'Content of greeting.txt:' + COLORS.RESET, data)
// 					}
// 				})
// 				/* ----------------------------- Read Directory ----------------------------- */
// 				//NB for current directory use: fs.readdir('.', (err, files) => {
// 				fs.readdir(path.join(__dirname, 'child-dir'), (err, files) => {
// 					if (err) {
// 						throw err
// 					} else {
// 						console.log(COLORS.ORANGE + 'List of files in the directory "child-dir":' + COLORS.RESET, files)
// 					}
// 				})
// 			}
// 		})
// 	}
// })

/*//* ----------------- Part 8 — File Operations (async/await) ----------------- */
//# Use modern async/await style to check existence, read, delete, create, append, and rename files.

// const fs = require('fs')
// const path = require('path')
// const fsPromises = require('fs').promises
//
// const fileOPS = async () => {
// 	try {
// 		if (!(await checkFileExistsSync(path.join(__dirname, 'child-dir', 'greeting.txt')))) {
// 			await fsPromises.writeFile(path.join(__dirname, 'child-dir', 'greeting.txt'), 'Hello friends!')
// 		}
// 		const data = await fsPromises.readFile(path.join(__dirname, 'child-dir', 'greeting.txt'), 'utf8') //read and save content
// 		console.log(COLORS.ORANGE + 'Content of greeting.txt:' + COLORS.RESET, data)
//
// 		await fsPromises.unlink(path.join(__dirname, 'child-dir', 'greeting.txt')) //delete
// 		await fsPromises.writeFile(path.join(__dirname, 'child-dir', 'promiseWrite.txt'), data) //create a new file with the same content
// 		await fsPromises.appendFile(path.join(__dirname, 'child-dir', 'promiseWrite.txt'), ' This is appended text.') //append text to the file
// 		await fsPromises.rename(path.join(__dirname, 'child-dir', 'promiseWrite.txt'), path.join(__dirname, 'child-dir', 'newName.txt')) //rename/move file
// 		const newData = await fsPromises.readFile(path.join(__dirname, 'child-dir', 'newName.txt'), 'utf8') //read and save new content
// 		console.log(COLORS.ORANGE + 'Content of newName.txt:' + COLORS.RESET, newData)
// 	} catch (err) {
// 		throw err
// 	}
// }
//
// fileOPS()
