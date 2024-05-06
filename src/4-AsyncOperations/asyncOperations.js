const { readFile} = require('fs');
const path = require('path');


console.log('first task')

const resolvedPath = path.resolve(__dirname, '../', 'sampleFiles', 'subFolder' , 'test.txt');


const getText = (path) => {
  return new Promise((resolve, reject) => {
    readFile(path, 'utf-8', (err, data) => {
      if(err) {
        reject(err)
        return
      } else {
        resolve(data)
      }
    })
  })

}

// getText(resolvedPath).then(result => console.log(result)).catch(err => console.log(err));


//await waits until the promise is resolved, wrap all of them in a try catch block


const start = async () => {
  const first = await getText(resolvedPath);
  console.log('my async task is now complete', first);
}

start();



console.log('second task')


// In Node.js, asynchronous operations are a fundamental aspect of its design, allowing it to handle I/O-bound tasks efficiently without blocking the execution of other code. Here's how asynchronous operations are handled in Node.js:

//     Non-Blocking I/O Model: Node.js follows a non-blocking, event-driven I/O model. When an asynchronous operation is initiated (such as reading from a file, making an HTTP request, or querying a database), Node.js doesn't wait for the operation to complete. Instead, it continues executing other code.

//     Event Loop: Node.js uses an event loop to handle asynchronous operations. The event loop continuously checks for events and executes associated callback functions when those events occur. It allows Node.js to handle multiple asynchronous operations concurrently without blocking the execution of other code.

//     Callback Functions: Asynchronous operations in Node.js typically accept callback functions as arguments. These callback functions are invoked once the asynchronous operation completes or encounters an error. This pattern is known as the "error-first callback" pattern, where the first argument of the callback function is reserved for an error object (if any).

//     Promises and Async/Await: While callback functions are a common way to handle asynchronous operations in Node.js, modern JavaScript features like Promises and Async/Await provide more elegant and readable alternatives. Promises allow you to chain asynchronous operations together and handle errors more effectively. Async/Await provides syntactic sugar for writing asynchronous code in a synchronous style, making it easier to reason about and maintain.

//     Event Emitters: Some asynchronous operations in Node.js involve events. For example, when working with streams or web servers, events are emitted to signal various states or data availability. You can listen for these events and respond accordingly using event listeners.

//     Error Handling: Proper error handling is crucial when dealing with asynchronous operations in Node.js. Since errors are typically propagated through callback functions or Promise rejections, it's essential to handle errors appropriately to prevent crashing the application and ensure graceful error recovery.

//     Concurrency Control: Node.js provides mechanisms for controlling concurrency, such as limiting the number of concurrent asynchronous operations or coordinating the execution of multiple asynchronous tasks. Libraries like async or features like Promise.all() can be used for managing concurrency in Node.js applications.