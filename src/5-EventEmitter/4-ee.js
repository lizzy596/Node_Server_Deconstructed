const EventEmitter = require('events');


class TaskManager extends EventEmitter {
  constructor() {
    super(); // Call the parent class constructor
  }

  customMethod() {
    console.log('This is a custom method in MyEmitter.');
    this.emit('customEvent', 'data from customMethod');
  }
}
const TaskManager = new EventEmitter();

