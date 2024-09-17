Node is an asynchrounous event-driven, non-blocking Javascript runtime. Node keeps a browser-based model in being event-driven. When you click a button, an event fires, and a function runs that had been previously defined but not yet executed.

I/O operations are operations of the server such as disk and network access that are comparatively slow to complete. We don't want the runtime to block business logic from executing while reading files or sending messages over the network.

To solve for block node does three things:

Events
Asynchrouns Apis
Non-blocking I/O

Non-blocking I/O means your program can make a request for a network resource while doing something else and then, when the network operatin has finished, a callback will run that handles the result. 


-The Database is accessed over the network---this is non-blocking because Node uses libuv to provide access to the operating system's nonblocking network class.

-Disk Access---this is non-blocking due to libuv too, using its thread pool to provide the illusion that a nonblocking call is being used.