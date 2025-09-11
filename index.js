import EventEmitter from 'events'
import logEvents from './logEvents.js'

class MyEmitter extends EventEmitter {}

const emitter = new MyEmitter()
emitter.on('log', (msg, fileName) => logEvents(msg, fileName))
setTimeout(() => {
	emitter.emit('log', 'Something changed!', 'eventLog.txt')
}, 2000)
