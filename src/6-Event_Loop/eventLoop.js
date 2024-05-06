const { readFile} = require('fs')
const path = require('path')


//LONG TASK 
// console.log('first task')
// console.time()
// for(let i = 0; i < 10000000000; i++) {
//   const word = 'dog'
//   console.log(word)
// }

// console.timeEnd()

// console.log('next task')
const resolvedPath = path.resolve(__dirname, '../', 'sampleFiles', 'subFolder', 'test.txt');
// const resolvedPath = path.resolve(__dirname, 'sampleDoc',  'example.txt');
console.log('1. first task')
readFile(resolvedPath, 'utf-8', (err, result) => {
  if(err) {
    console.log(err)
    return
  }

  console.log('2. result of async task:', result)
  console.log('3. completed first task')
})

console.log('4. staring second task ')


// console.log('first task')
// setTimeout(() => {
//   console.log('second task')
// }, 0)

// console.log('third task')




// The event loop is a fundamental concept in Node.js (and also in browser-based JavaScript) that allows asynchronous operations to be handled efficiently without blocking the execution of other code. It's what allows Node.js to be non-blocking and handle high concurrency.

// Here's how it works:

//     Event Queue: When you run Node.js code, any asynchronous tasks (like reading files, making HTTP requests, etc.) are initiated, and their completion is managed by Node.js's internal mechanisms. As these asynchronous tasks complete, their callback functions are placed into a queue known as the event queue.

//     Event Loop: The event loop constantly checks two things: the call stack and the event queue. The call stack is where synchronous tasks are placed as they are executed. If the call stack is empty and there are functions waiting in the event queue, the event loop takes the first callback from the event queue and pushes it onto the call stack, where it's executed.

//     Non-blocking: Because the event loop continuously checks for tasks in the event queue while the call stack is empty, it ensures that the Node.js process remains responsive and can handle multiple concurrent tasks without getting blocked.

// In Node.js, most I/O operations, like file system operations or network requests, are non-blocking, meaning they don't wait for the operation to complete before moving on to the next task. Instead, they initiate the operation and provide a callback function that gets executed once the operation is finished. This callback is then placed in the event queue, and when the event loop gets to it, it's executed.

// This event-driven architecture is what makes Node.js well-suited for building highly scalable and performant applications, especially for handling I/O-heavy tasks. It allows Node.js to efficiently manage multiple operations concurrently without relying on traditional threading models, which can be resource-intensive and complex to manage.