const path = require('path');

const pathModule = () => {

//Path separator-what separates things on your specific device ex. /
console.log('what separates files on your system', path.sep)

// File paths
//const filePath2 = '/another/path/file2.txt';

// Joining file paths

const filePath = path.join('/sampleDoc', 'subFolder', 'test.txt')
console.log('Joined path to test doc:', filePath);

// Getting the base name of a file path
console.log('File name :', path.basename(filePath));

// Getting the directory name of a file path

console.log('Directory name :', path.dirname(filePath));

// Resolving a file path-gives absolute path
//__dirname gives the path to the directory you're currently working in

const resolvedPath = path.resolve(__dirname, 'sampleDoc', 'subFolder', 'test.txt');
console.log('Resolved path:', resolvedPath);

// Getting the extension of a file path

console.log('File extension :', path.extname(filePath));

}

pathModule();


// The path module in Node.js provides utilities for working with file and directory paths in a platform-independent way. Here are some key points to understand about the path module:

//     Platform Independence: The path module helps in writing code that works across different operating systems (such as Windows, macOS, and Linux) by abstracting away the differences in path formats and separators.

//     Path Parsing: You can use the path.parse() method to parse a given path into its components such as root, directory, base (file name with extension), name (file name without extension), and extension.

//     Path Joining: The path.join() method joins all the given path segments together using the platform-specific separator (\ on Windows and / on POSIX systems) to form a single path string.

//     Path Normalization: path.normalize() can be used to normalize a given path by resolving '..' and '.' segments, and removing redundant separators.

//     Path Resolution: path.resolve() resolves a sequence of paths or path segments into an absolute path, starting from the root of the file system. It can be useful for creating absolute paths from relative ones.

//     Path Relative to Base Path: path.relative() returns the relative path from one specified path to another. This can be handy when you want to determine how to move from one directory to another.

//     Joining Paths Safely: path.join() can be safer than simple string concatenation because it handles platform-specific path separators correctly and avoids issues related to trailing or double separators.

//     Path Extname: path.extname() extracts the extension (including the dot) of a given file path.

//     Path Separator Constants: The path.sep property contains the platform-specific path segment separator (\ on Windows, / on POSIX systems), and path.delimiter contains the platform-specific path delimiter used in the PATH environment variable (; on Windows, : on POSIX systems).

//     Directory Separator Constants: The path.dirname() method returns the directory name of a path, and path.basename() returns the last portion of a path, similar to the shell command basename.