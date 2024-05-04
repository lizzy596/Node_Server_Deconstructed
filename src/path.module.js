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