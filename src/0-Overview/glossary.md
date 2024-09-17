**Program:**A program is a static set of instructions and data written in a programming language, stored on disk as a file. It defines what tasks should be performed but remains inactive until executed by the operating system.

**Process:**A process is an active execution of a program by the operating system, which includes the program's code, current state (such as register values and memory), and allocated resources. It runs in memory, consuming system resources like CPU and RAM. Multiple processes can be created from the same program.

**Thread:**A thread is the smallest unit of execution within a process, representing a sequence of instructions that can run independently. Multiple threads can exist within the same process, sharing resources like memory but executing concurrently. This allows for parallelism and more efficient multitasking within a program.Threads within the same process share the same address space, meaning they can access the same variables, data, and resources allocated by the process. However, each thread maintains its own execution context, which includes its own program counter, stack, and register values. This allows threads to run independently while still accessing shared memory, but proper synchronization (e.g., locks, semaphores) is required to prevent data inconsistencies when multiple threads interact with shared data.A thread is a lightweight, independent unit of execution within a process, allowing multiple tasks to run concurrently. Threads in the same process share memory and resources but have their own execution state, such as registers and stack. This enables efficient multitasking and parallelism within a program.

**Thread Pool:**A thread pool is a collection of pre-initialized worker threads that are reused to execute tasks, improving performance by avoiding the overhead of creating and destroying threads repeatedly. When a task is submitted, it is assigned to an available thread from the pool, allowing for efficient management of concurrent execution. This approach optimizes resource usage and helps prevent system overload from too many threads running simultaneously.

**Stack:**Stack memory is a region where temporary data such as local variables, function call information (like return addresses and parameters), and control flow (such as function calls) are stored. It follows a Last In, First Out (LIFO) structure, meaning data is pushed and popped in a defined order. The stack is typically small, fast, and automatically managed, with memory allocated and deallocated as functions are called and return.

**Heap:**Heap memory is a larger region used for dynamic memory allocation, where objects and variables are allocated during runtime and stay in memory until manually freed or garbage collected. Unlike stack memory, the heap allows for more flexible memory usage but requires explicit management and is generally slower due to the need to allocate and deallocate memory manually.

**Operating System**
**W**
**W**

**W**
**W**
v
**W**

v
**W**
**W**
**W**
v

**W**
v
**W**

**W**
**W**
**W**
v

**W**
v
**W**
v
**W**

v
**W**