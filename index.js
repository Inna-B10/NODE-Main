import EventEmitter from 'events'
import logEvents from './logEvents.js'

class MyEmitter extends EventEmitter {}

const emitter = new MyEmitter()
emitter.on('log', msg => logEvents(msg))
setTimeout(() => {
	emitter.emit('log', 'Something changed!')
}, 2000)
