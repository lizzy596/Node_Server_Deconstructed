This is a very basic Node REST server with no frameworks, just vanilla node.js.




Node is an asynchronous event-driven JavaScript runtime

This is in contrast to today's more common concurrency model, in which OS threads are employed. Thread-based networking is relatively inefficient and very difficult to use. Furthermore, users of Node.js are free from worries of dead-locking the process, since there are no locks. Almost no function in Node.js directly performs I/O, so the process never blocks except when the I/O is performed using synchronous methods of Node.js standard library. Because nothing blocks, scalable systems are very reasonable to develop in Node.js.

Blocking is when the execution of additional JavaScript in the Node.js process must wait until a non-JavaScript operation completes. This happens because the event loop is unable to continue running JavaScript while a blocking operation is occurring.

In Node.js, JavaScript that exhibits poor performance due to being CPU intensive rather than waiting on a non-JavaScript operation, such as I/O, isn't typically referred to as blocking. Synchronous methods in the Node.js standard library that use libuv are the most commonly used blocking operations. Native modules may also have blocking methods.

All of the I/O methods in the Node.js standard library provide asynchronous versions, which are non-blocking, and accept callback functions. Some methods also have blocking counterparts, which have names that end with Sync.

Async tasks get offloaded

For example: using the fs module:

SYNCHRONOUS:
const data = fs.readFileSync('/file.md'); //blocks until file is read
ASYNCHRONOUS:
fs.readFile('/file.md', (err, data) => {
  if (err) throw err;
});
he first example appears simpler than the second but has the disadvantage of the second line blocking the execution of any additional JavaScript until the entire file is read. Note that in the synchronous version if an error is thrown it will need to be caught or the process will crash. In the asynchronous version, it is up to the author to decide whether an error should throw as shown.



look at what the fs module prints when you run it synchronously vs asynchronously



GLOBALS:

In plain JS we have access to the Window object which is very useful when you're working with browser best applications
there is no window in node. But there is a concept of global variables. 

__dirname: path to current directory
__filename: file name
require: function to use modules (commonjs)
module: info about current module
process = info about env where the program is being executed


process is very useful  because when our app runs in production it will run on different enviornments, ex digital ocean




MODULES:

You split your code into modules. The key is a module is encapsulated code, so you only share what you want to share.
The built in module global has a property called exports which is just an empty object ex.  exports: {},
Everything dumped in this object (like your functions) is something you'll have access to globally



module.exports = thingBeingExported

module.exports = { firstThing, secondThing }

you can also export like this since module.exports is an empty object, this is like setting a property on an object

modules.exports.items = ['item1', 'item2]




You can also import code just like require('./someModule'), if we have a function inside the module that we invoke in that module, because when you import a
module you are actually invoking it already (because when node exports the code its actually wrapping it in a function).


HTTP MODULE

Notice that we are not exiting when we run an http server, because we servers continue to listen


package-lock.json --keeps a record of the version of your dependencies and versions of the dependencies your dependencies use



NODE EVENT LOOP

The event loop is what allows Node.js to perform non-blocking I/O operations — despite the fact that JavaScript is single-threaded — by offloading operations to the system kernel whenever possible.Since most modern kernels are multi-threaded, they can handle multiple operations executing in the background. When one of these operations completes, the kernel tells Node.js so that the appropriate callback may be added to the poll queue to eventually be executed. We'll explain this in further detail later in this topic.

Each phase has a FIFO queue of callbacks to execute. While each phase is special in its own way, generally, when the event loop enters a given phase, it will perform any operations specific to that phase, then execute callbacks in that phase's queue until the queue has been exhausted or the maximum number of callbacks has executed. When the queue has been exhausted or the callback limit is reached, the event loop will move to the next phase, and so on.

Phases Overview

    timers: this phase executes callbacks scheduled by setTimeout() and setInterval().  timer specifies the threshold after which a provided callback may be executed rather than the exact time a person wants it to be executed. 
    pending callbacks: executes I/O callbacks deferred to the next loop iteration.
    idle, prepare: only used internally.
    poll: retrieve new I/O events; execute I/O related callbacks (almost all with the exception of close callbacks, the ones scheduled by timers, and setImmediate()); node will block here when appropriate.
    check: setImmediate() callbacks are invoked here.
    close callbacks: some close callbacks, e.g. socket.on('close', ...).



Users make requests -> what if some user makes a time consuming request -> Reigster CB (these are DB tasks, FS, networks, etc) so the event loop registers the callback, then off loads the task in the background, when the task is complete it rejoins the event loop
and executes the callback


setTimeout actions are off loaded and return to the event loop when the callback has completed
setInteval processes must be killed, because the callback continues to fire at reqular intevals, this is
similar to server.listen, which is an asynchronous and the event loop just continues to listen for requests to come to the server



EVENT DRIVEN PROGRAM

-the flow of the program is at least partly determined  by undertaken events (like user events)

We listen for specific events and register functions that will execute when those events occur


ORDER of events matter, listen for it before you emit it



STREAMS
Used to read or write data sequentially

writeable, readable, 

duplex - read and write

transform - data can be modified

Streams extend event emitter class


