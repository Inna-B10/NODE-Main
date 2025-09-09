used packages:

```bash
npm install nodemon -g    # to monitor changes
npm init                  # to create package.json
npm install date-fns
npm install nodemon -D
npm install uuid
```

#### Remember to save files before runing the code, use **clear** to clean the terminal and **ctrl+c** to stop nodemon

---

### Start project from scratch

1. start with new folder and file index.js
2. terminal: **npm install nodemon -g** -> run
3. index.js: **console.log("I'm done)** -> save
4. terminal: **nodemon** -> run
5. terminal: **npm init** -> run and follow instruction
6. create file **.gitignore**
<pre>
  /node_modules   
  /logs</pre>
7. terminal: **npm install date-fns** -> run
8. index.js:  
   before console.log("I'm done) add **const {format} = require("date-fns")**  
   after console.log("I'm done) add **console.log(format(new Date(), "ddMMYYYY\tHH:mm:ss"))**
9. terminal: **nodemon** -> run
10. terminal: **npm install nodemon -D** -> run
11. package.json: replace
    "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
    },  
    with  
    **"scripts": {
    "start": "node index",
    "dev": "nodemon"
    },**
12. terminal: **npm run dev** -> run
13. terminal: **npm install uuid** -> run
14. index.js: after
    const { format } = require('date-fns')  
    add  
    **const {v4:uuid} = require('uuid')**
15. index.js: after
    console.log(format(new Date(), 'ddMMyyyy\tHH:mm:ss'))  
    add  
    **console.log(uuid())**
16. terminal: **npm run dev** -> run
17. terminal: **Ctrl+C** -> to stop nodemon
18. index.js: after
    const { v4: uuid } = require('uuid')  
    add
    <pre>const fs = require('fs')  
    const path = require("path")  
    const fsPromises = require("fs").promises</pre>
19. index.js: rename file to **logEvents.js**
20. logEvents.js:  
     delete all console.logs  
     after all imports add
     <pre>const logEvents = async message => {
      const dateTime = `${format(new Date(), 'ddMMyyyy\tHH:mm:ss')}`
      const theLog = `${dateTime}\t${uuid()}\t${message}\n`
      console.log(theLog)
      try {
        if (!fs.existsSync(path.join(__dirname, 'logs'))) {
          await fsPromises.mkdir(path.join(__dirname, 'logs'))
        }
        await fsPromises.appendFile(path.join(__dirname, 'logs', 'eventLog.txt'), theLog)
      } catch (err) {
        console.error(err)
      }
    }
    module.exports = logEvents</pre>
21. create **index.js** file
22. index.js:
    <pre>const logEvents = require('./logEvents')
    const EventEmitter = require('events')
    
    class MyEmitter extends EventEmitter {}
    
    const emitter = new MyEmitter()
    emitter.on('log', msg => logEvents(msg))
    setTimeout(() => {
      emitter.emit('log', 'Something changed!')
    }, 2000)</pre>

23. terminal: **npm run dev** -> run  
    it will create folder _logs_ and file _eventLog.txt_
24. stop and start nodemon and see content of the eventLog.txt
