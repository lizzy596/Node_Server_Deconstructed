// In Node.js, there are several important global objects and variables available for developers to use throughout their applications. Here are some of the key ones:

//     global: This is the global namespace object in Node.js. Variables declared with var or let outside of any function or block scope become properties of the global object.

//     process: An instance of EventEmitter, it provides information and control over the current Node.js process. It contains properties such as process.env for environment variables, process.argv for command-line arguments, and methods like process.exit() for exiting the process.

//     console: An object used to print to stdout and stderr. It provides methods like console.log(), console.error(), console.warn(), etc., for logging messages.

//     module: An object representing the current module. It contains information about the current module, such as module.exports which is used to export the module's functions or objects.

//     exports: A reference to module.exports. It is used to define what should be exported from a module when using module.exports.

//     require(): A function used to import modules in Node.js. It is used to load modules from the file system or from built-in Node.js modules.

//     __filename: The absolute path of the current module file.

//     __dirname: The absolute path of the directory containing the current module file.


// Accessing global object
console.log('Global object:', global);

// Accessing process object
console.log('Process object:', process);

// Accessing console object
console.log('Console object:', console);

// Accessing module object
console.log('Module object:', module);

// Accessing exports object
console.log('Exports object:', exports);

// Accessing require function
console.log('Require function:', require);

// Accessing __filename
console.log('__filename:', __filename);

// Accessing __dirname
console.log('__dirname:', __dirname);
