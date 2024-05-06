const fs = require('fs');
const path = require('path');



const resolvedPath = path.resolve(__dirname, '../', 'sampleFiles', 'subFolder', 'test.txt');


 //read file synchronously--which is blocking


// writeFileSync(resolvedPath, `some code you're writing`)

const fsModule = () => {
const data = fs.readFileSync(resolvedPath);
console.log(data);
  }




// // Read file asynchronously

// // const fsModule =() => {
// // fs.readFile(resolvedPath, 'utf8', (err, data) => {
// //   if (err) {
// //     console.error('Error reading file:', err);
// //     return;
// //   }
// //   console.log('File contents:');
// //   console.log(data);
// // });
// // }
fsModule();

// The fs module in Node.js is crucial for interacting with the file system of your operating system. Here are some important things to know about it:

//     File Operations: fs provides methods to perform various file operations like reading from files, writing to files, appending data to files, renaming files, deleting files, and more.

//     Asynchronous and Synchronous Methods: Most methods in fs have both asynchronous and synchronous versions. The asynchronous methods take a callback function as an argument, which is called once the operation is completed, while synchronous methods block the execution until the operation finishes.

//     Error Handling: Asynchronous methods typically follow Node.js's error-first callback pattern. The first argument to the callback function is reserved for an error object. Synchronous methods throw exceptions when an error occurs.

//     Path Handling: fs deals with paths to files and directories. It provides methods to manipulate paths, join path segments, resolve paths, and extract file names and extensions.

//     Streams: fs supports streaming operations for reading and writing files. This allows for efficient handling of large files without loading the entire contents into memory.

//     Permissions and Ownership: fs allows you to query and modify file permissions, ownership, timestamps, and other metadata.

//     File Watching: fs provides functionality to watch for changes in files and directories. You can monitor for file modifications, deletions, and creations in real-time.

//     File System Stats: You can retrieve statistics about files and directories such as file size, type (file or directory), timestamps, and more using methods like fs.stat().

//     Working with Directories: fs enables you to create, read, update, and delete directories. It also provides methods for listing directory contents and recursively walking through directory trees.

//     Buffer Operations: Many fs methods deal with data in the form of Buffers, Node.js's built-in data structure for handling binary data. Buffers are efficient for reading and writing data, especially for binary files.