Node is an asynchronous event-driven, non-blocking Javascript runtime. Node keeps a browser-based model in being event-driven. When you click a button, an event fires, and a function runs that had been previously defined but not yet executed.

I/O operations are operations of the server such as disk and network access that are comparatively slow to complete. We don't want the runtime to block business logic from executing while reading files or sending messages over the network.

To solve for blocking node does three things:

Events
Asynchrouns Apis
Non-blocking I/O

Non-blocking I/O means your program can make a request for a network resource while doing something else and then, when the network operatin has finished, a callback will run that handles the result. 


-The Database is accessed over the network---this is non-blocking because Node uses libuv to provide access to the operating system's nonblocking network calls.

-Disk Access---this is non-blocking due to libuv too, using its thread pool to provide the illusion that a non-blocking call is being used.

**V8 Engine**

v8 engine is written in c++ and complies and executes javascript code inside of a virtual machine, the node process object refers to the v8 runtime

max-stack-size: can change the size of the call stack
max_old_space_size: can control the amount of memory available to a process
can control the garbage collection nouse-idele-notifcation