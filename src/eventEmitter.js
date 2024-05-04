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