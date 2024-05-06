const EventEmitter = require('events');

const customEmitter = new EventEmitter()

//on a response fire this callback
customEmitter.on('response', (response) => {
  console.log('data received')
});

customEmitter.on('response', (name, age) => {
  console.log(`happy response received from ${name} ${age}`)
});


//make the event happen

customEmitter.emit('response')
customEmitter.emit('response', 'john', 34)

// //create an instance of EventEmitter
// const myEmitter = new EventEmitter()


// // Emit the 'something' event
// myEmitter.emit('something'); // This will trigger the event handler

// // Remove the event listener
// myEmitter.removeListener('something', myEventHandler);

// //on a response fire this callback
// customEmitter.on('response', (response) => {
//   console.log('data received')
// });

// customEmitter.on('response', (name, age) => {
//   console.log(`happy response received from ${name} ${age}`)
// });







// If you worked with JavaScript in the browser, you know how much of the interaction of the user is handled through events: mouse clicks, keyboard button presses, reacting to mouse movements, and so on.

// On the backend side, Node.js offers us the option to build a similar system using the events module.

// This module, in particular, offers the EventEmitter class, which we'll use to handle our events.

// This object exposes, among many others, the on and emit methods.

//     emit is used to trigger an event
//     on is used to add a callback function that's going to be executed when the event is triggered



//create an instance of EventEmitter
// const customEmitter = new EventEmitter()

// // Define an event handler
// const myEventHandler = () => {
//   console.log('Something happened!');
// };

// myEmitter.on('something', myEventHandler);

// // Emit the 'something' event
// myEmitter.emit('something'); // This will trigger the event handler

// // Remove the event listener
// myEmitter.removeListener('something', myEventHandler);