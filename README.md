# **0. Basic Node**

This is a very basic Node REST server with no frameworks, just vanilla node.js.

## **What is Node?**

Node is an asynchronous event-driven JavaScript runtime

This is in contrast to today's more common concurrency model, in which OS threads are employed. Thread-based networking is relatively inefficient and very difficult to use. Furthermore, users of Node.js are free from worries of dead-locking the process, since there are no locks. **Almost no function in Node.js directly performs I/O, so the process never blocks except when the I/O is performed using synchronous methods of Node.js** standard library. Because nothing blocks, scalable systems are very reasonable to develop in Node.js.

Blocking is when the execution of additional JavaScript in the Node.js process must wait until a non-JavaScript operation completes. This happens because the event loop is unable to continue running JavaScript while a blocking operation is occurring.

Synchronous methods in the Node.js standard library that use libuv are the most commonly used blocking operations. Native modules may also have blocking methods.

All of the I/O methods in the Node.js standard library provide asynchronous versions, which are non-blocking, and accept callback functions. Some methods also have blocking counterparts, which have names that end with Sync.

**Async tasks get offloaded**

_For example: using the fs module:_

**SYNCHRONOUS:**

const data = fs.readFileSync('/file.md'); //blocks until file is read

**ASYNCHRONOUS:**

fs.readFile('/file.md', (err, data) => {
  if (err) throw err;
});

The first example appears simpler than the second but has the disadvantage of the second line blocking the execution of any additional JavaScript until the entire file is read. Note that in the synchronous version if an error is thrown it will need to be caught or the process will crash. In the asynchronous version, it is up to the author to decide whether an error should throw as shown.



Look at the example code and see what the fs module prints when you run it synchronously vs asynchronously.



### **GLOBALS:**

In plain JS we have access to the Window object which is very useful when you're working with browser best applications
there is no window in node. But there is a concept of global variables. 

**__dirname:** path to current directory
**__filename:** file name
**require:** function to use modules (commonjs)
**module:** info about current module
**process** = info about env where the program is being executed, process is referring to the current node process that is running


process is very useful  because when our app runs in production it will run on different enviornments, ex digital ocean




### **MODULES:**

You split your code into modules. The key is that a module is encapsulated code, so you only share what you want to share.
The built in module global has a property called exports which is just an empty object **ex.  exports: {}**,
Everything dumped in this object (like your functions) is something you'll have access to globally



module.exports = thingBeingExported

module.exports = { firstThing, secondThing }

you can also export like this since module.exports is an empty object, this is like setting a property on an object:

modules.exports.items = ['item1', 'item2]




You can also import code just like this require('./someModule'), if we have a function inside the module that we invoke in that module, because when you import a
module you are actually invoking it already (because when node exports the code its actually wrapping the exported code in a function).

Some of the built in modules include: http, fs, buffer, os, process, stream, events, path


HTTP MODULE - Notice that we are not exiting when we run an http server, because we servers continue to listen


**package-lock.json** --keeps a record of the version of your dependencies and versions of the dependencies your dependencies use



### **NODE EVENT LOOP**

The event loop is what allows Node.js to perform non-blocking I/O operations — despite the fact that JavaScript is single-threaded — by offloading operations to the system kernel whenever possible.Since most modern kernels are multi-threaded, they can handle multiple operations executing in the background. When one of these operations completes, the kernel tells Node.js so that the appropriate callback may be added to the poll queue to eventually be executed. We'll explain this in further detail later in this topic.

Each phase has a FIFO queue of callbacks to execute. While each phase is special in its own way, generally, when the event loop enters a given phase, it will perform any operations specific to that phase, then execute callbacks in that phase's queue until the queue has been exhausted or the maximum number of callbacks has executed. When the queue has been exhausted or the callback limit is reached, the event loop will move to the next phase, and so on.

Phases Overview

    timers: this phase executes callbacks scheduled by setTimeout() and setInterval().  timer specifies the threshold after which a provided callback may be executed rather than the exact time a person wants it to be executed. 
    pending callbacks: executes I/O callbacks deferred to the next loop iteration.
    idle, prepare: only used internally.
    poll: retrieve new I/O events; execute I/O related callbacks (almost all with the exception of close callbacks, the ones scheduled by timers, and setImmediate()); node will block here when appropriate.
    check: setImmediate() callbacks are invoked here.
    close callbacks: some close callbacks, e.g. socket.on('close', ...).


Mental Model: 

Users make requests -> Now what if some user makes a time consuming request? -> Reigster CB (these are DB tasks, FS, networks, etc) so the event loop registers the callback, then off loads the task in the background, when the task is complete it rejoins the event loop and executes the callback


-setTimeout actions are off loaded and return to the event loop when the callback has completed
-setInteval processes must be killed, because the callback continues to fire at reqular intevals, this is similar to server.listen, which is an asynchronous and the event loop just continues to listen for requests to come to the server



**EVENT DRIVEN PROGRAM**

The flow of the program is at least partly determined  by undertaken events (like user events)

We listen for specific events and register functions that will execute when those events occur


ORDER of events matter, listen for it before you emit it



**STREAMS**

Used to read or write data sequentially

writeable, readable, 

duplex - read and write

transform - data can be modified

Streams extend event emitter class

### **Threads in Node:**

Code executed in work threads runs in a separate child process and doesnt block the main app. Clust modules can be used to run multiple node
instances that can distribute workloads. The work_threads module allows for running multiple application threads within a single node instance
When process isolation is not need, that is no separate instances of v8, event loop and memory are needed, use worker threads.


**Concurreny vs Parallelism:** 

Normally JS is a single-threaded language, meaning it can only take advantage of one cpu core, called the main thread. However due to the event loop, this one thread can execute code concurrently.

**Concurrency-** Blocking code is executed off the main thread, and then when it completes it returns to the main thread. Its literally like saying, execute some code, then call me back. With concurrency you're doing different jobs that overlap over different time periods in no specific order.

ex. one cook in the kitchen cooking multiple meals for different customers, one on the stove, one in the oven, one in the microwave.

**Parallelism-** is also about doing multiple things at once, but it utilizes multiple cpu cores to perform operations that would otherwise block the main thread.Its like a main chef having multiple sous chefs helping 
him prepare multiple meals at the same time. Ideal for multiple cpu-intensive jobs running at the same time. It will help with multiple image processing simultaneously etc. it is not that helpful for i/o work, like reading and writing from a filesystem, DB or network communication, because in those cases you're waiting for the network or disc to supply the actual data and the cpu cant really speed that up.So multithreading doesn't automatically mean speeding everything up, it spreads work over multiple cpu cores when the cpu is doing the heavy lifting.


A core refers to the physical component of the cpu itself, which can only execute one task at a time. The amount of node workers
you can run in parallel is equal to the amount of cpu cores you have.


## **Basic Request/Response Cycle**


Every time we type a url into the browser we are sending a request to the server that has those resources.

Request Message - Has a method, headers and an optional body, URl

Response Message -> Status Code, Status Text, Headers, and an Optional Body

content-type: text/html or application/json


    Informational responses (100 – 199)
    Successful responses (200 – 299)
    Redirection messages (300 – 399)
    Client error responses (400 – 499)
    Server error responses (500 – 599)


    The internet is fundamentally about passing packets back and forth.

    5 layers to a packet
    Physical- cables
    Link- wifi/ethernet
    Network- IP
    Transport- UDP/TCP
    Application- http/ftp/smtp etc


**Transport and Network layer together form TCP/IP**


UDP- FAST, UNRELIABLE lightweight, 8 bytes for a header, connectionless, consistency, will send data no matter what, doesnt care about packet loss or order, big win is that it is very fast.
TCP- RELIABLE connection-based, you must go through a three-way handshake, 1. client says id like to connect 2. server says yes or no 3. data starts streaming, very reliable. Delivery acknowledgements,
lets client know the data was received, retransmission of data is possible, packets in order


Initally http just made to pass around html, now it can pass many types of digital files. First webpage ever: http://info.cern.ch/. HTT is only connected when required. It can disconnect and re-establish the connection to send a response. It is stateless-there is no dialogue. Once the connection is closed to two machines forget each other.  As soon as the 
request hits the server the http connection is terminated. The TCP connection is still open. The http connection will reopen to send the response.

HTTP Mesage:

1. start line -describes the type of request ex. GET /blog http/1.1
2. header -metadata, key-value pairs, content-type: text/plain
3. body -actual stuff

For the homepage the / is added by the browser http://localhost/



To-Do: Add example using worker threads in node



**Miscellaneous** 

Node.js behavior for uncaught exceptions is to print current stack trace and then terminate the thread. However, Node.js allows customization of this behavior. It provides a global object named process that is available to all Node.js applications. It is an EventEmitter object and in case of an uncaught exception, uncaughtException event is emitted and it is brought up to the main event loop. In order to provide a custom behavior for uncaught exceptions, you can bind to this event. However, resuming the application after such an uncaught exception can lead to further problems. Therefore, if you do not want to miss any uncaught exception, you should bind to uncaughtException event and cleanup any allocated resources like file descriptors, handles and similar before shutting down the process. Resuming the application is strongly discouraged as the application will be in an unknown state. It is important to note that when displaying error messages to the user in case of an uncaught exception, detailed information like stack traces should not be revealed to the user. Instead, custom error messages should be shown to the users in order not to cause any information leakage.

When using EventEmitter, errors can occur anywhere in the event chain. Normally, if an error occurs in an EventEmitter object, an error event that has an Error object as an argument is called. However, if there are no attached listeners to that error event, the Error object that is sent as an argument is thrown and becomes an uncaught exception. In short, if you do not handle errors within an EventEmitter object properly, these unhandled errors may crash your application. Therefore, you should always listen to error events when using EventEmitter objects.

Errors that occur within asynchronous callbacks are easy to miss. Therefore, as a general principle first argument to the asynchronous calls should be an Error object. Also, express routes handle errors itself, but it should be always remembered that errors occurred in asynchronous calls made within express routes are not handled, unless an Error object is sent as a first argument.

Errors in these callbacks can be propagated as many times as possible. Each callback that the error has been propagated to can ignore, handle or propagate the error.