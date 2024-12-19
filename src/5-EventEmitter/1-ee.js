const EventEmitter = require('events');
const emitter = new EventEmitter();




//Use ON to bind a function to a given event. In this case the event is called GREET and the callback function will print to console when this event is emitted

emitter.on('greet', () => {
  console.log('This is the callback that fires when a Greet event occurs');
});

//GREET Event is emitted

emitter.emit('greet'); 

console.log('print the emitter you just created', emitter);

//console.log of the emitter object

// {
//   _events: [Object: null prototype] { greet: [Function (anonymous)] },
//   _eventsCount: 1,
//   _maxListeners: undefined,
//   [Symbol(kCapture)]: false
// }
