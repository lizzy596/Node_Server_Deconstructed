The EventEmitter class is a foundational tool for creating and managing asynchronous event-driven patterns in Node.js applications.




The EventEmitter is a core part of Node.js, used to handle asynchronous events. 


It allows you to define custom events and listeners that get triggered when those events are emitted. 
It follows the publish-subscribe pattern, where one part of your code can publish (or emit) an event and other parts can listen for that event and respond.


CHANNEL: {"_events":{},"_eventsCount":1,"clients":{},"subscriptions":{}}


An event is emitted by calling the .emit() method, which triggers the event with a specified name:
myEmitter.emit('eventName');


**1. Create an Event**

const EventEmitter = require('node:events');

const EventEmitter = require('events');
const myEmitter = new EventEmitter();

**2. Listen for an Event**

You can listen for an event using the .on() method. When the event is emitted, all listeners for that event will be triggered:

myEmitter.on('eventName', () => {
  console.log('An event occurred!');
});


**3. Emit an Event**

myEmitter.emit('eventName');



**Key Methods**

on(eventName, listener): Registers a listener that is triggered every time the event is emitted.

once(eventName, listener): Registers a listener that is triggered only once, the first time the event is emitted.

emit(eventName, [...args]): Emits the specified event and passes the provided arguments to the listeners.

removeListener(eventName, listener): Removes a listener for the event.





const http = require('http');

const server = http.createServer((req, res) => {
  res.end('Hello World');
});

server.on('request', (req, res) => {
  console.log('Request received');
});

server.listen(3000);

In this example, every time a request is made to the server, the 'request' event is emitted, and the corresponding listener is triggered.



**As a best practice, listeners should always be added for the 'error' events.**

const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.on('error', (err) => {
  console.error('whoops! there was an error');
});
myEmitter.emit('error', new Error('whoops!'));