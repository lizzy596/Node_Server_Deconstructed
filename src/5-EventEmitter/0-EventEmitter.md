Node has an event-driven architecture, inherited from browser-based javascript. If you worked with JavaScript in the browser, you know how much of the interaction of the user is handled through events: mouse clicks, keyboard button presses, reacting to mouse movements, and so on.

Event-driven programming means the flow of the program is determined by events such as user actions, sensor outputs, or messages from other programs.  In this model, events are captured by event handlers or listeners, which respond to the events by executing specific functions or actions. 

This approach is commonly used in graphical user interfaces (GUIs), web applications, and real-time systems.

On the backend side, Node.js offers us the option to build a similar system using the events module.
The EventEmitter is a class within the event module that allows you to listen for given events and it will perform an action, i.e. execute code (by binding a callback function). It follows the publish-subscribe pattern, where one part of your code can publish (or emit) an event and other parts can listen for that event and respond.

This object exposes, among many others, the on and emit methods.


**Key Methods**

**on/once:** register listeners for events (repeated or one time)

**emit:** trigger events and pass to listeners

The are also methods to remove listeners and to see all listeners





const customEmitter = new EventEmitter()

 **Define an event handler**

 const myEventHandler = () => {
 console.log('Something happened!');
};

myEmitter.on('something', myEventHandler);

**Emit the 'something' event**

myEmitter.emit('something'); // This will trigger the event handler

**Remove the event listener**

myEmitter.removeListener('something', myEventHandler);



**The Request and Response model Follows an Event Driven Pattern**


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

**Excerise 1**


Create a TaskManager class that extends EventEmitter.

Features:
Add tasks to a queue using the addTask(taskName) method.
Emit an taskAdded event whenever a new task is added.
Simulate processing a task by emitting a taskProcessing event after a delay.
Complete a task and emit a taskCompleted event.

Listeners:
Add a listener to log whenever a task is added.
Add a listener to simulate task processing after a task is added.
Add a listener to log when a task is completed.

Bonus:
Track the number of completed tasks.
Add a getTaskCount() method to display how many tasks are in the queue and how many are completed.

Bonus:
Bonus Challenges
Add a taskFailed event and simulate occasional task failures.
Implement a retry mechanism for failed tasks.
Allow multiple listeners for taskCompleted to log metrics or notify other systems.

**Exercise 2: Simple Chat Application**

In this exercise, you will create a basic chat room simulation using the EventEmitter class. The goal is to simulate users joining the chat room, sending messages, and leaving the chat room.
Requirements

    Use the EventEmitter class from the events module.
    Create custom events to handle:
        A user joining the chat.
        A user sending a message.
        A user leaving the chat.
    Add listeners for each event that log appropriate messages to the console.

