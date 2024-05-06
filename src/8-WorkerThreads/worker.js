const { Worker, isMainThread, parentPort } = require('worker_threads');
const intensiveTask = require('./intensiveTask');

if (isMainThread) {
  // This code runs in the main thread
  console.log('Main thread started.');

  // Create a new worker
  const worker = new Worker(intensiveTask);

  // Listen for messages from the worker
  worker.on('message', message => {
    console.log('Received message from worker:', message);
  });

  // Send a message to the worker
  worker.postMessage('Hello from main thread!');
} else {
  // This code runs in the worker thread
  console.log('Worker thread started.');

  // Listen for messages from the main thread
  parentPort.on('message', message => {
    console.log('Received message from main thread:', message);

    // Send a message back to the main thread
    parentPort.postMessage('Hello from worker thread!');
  });
}
