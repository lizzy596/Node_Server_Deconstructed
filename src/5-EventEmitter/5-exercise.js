const EventEmitter = require('events');


class TaskManager extends EventEmitter {
  constructor() {
    super(); // Call the parent class constructor
  }

taskQueue = []; 

taskCompleted = 0;

addTask(task) {
    taskQueue.push(task);
    console.log(`This ${task} was added to the queue`);
  };
processTask(taskName, delay) {
    console.log(`Started processing task: ${taskName}`);
     setTimeout(() => {
      this.emit('taskProcessing', taskName);
    }, delay);
  }
completeTask(taskName) {
    console.log(`Task ${taskName} is completed`);
    taskCompleted++;
 
  }

getTaskCount() {
    console.log(`The number of completed tasks is ${this.taskCompleted}`);
    this.emit('customEvent', 'data from customMethod');
  }
}


const tasker = new TaskManager();

task.on('taskAdded', addTask)