const fs = require('fs');
const path = require('path');

// File path


const resolvedPath = path.resolve(__dirname, 'sampleDoc', 'subFolder', 'test.txt');


//read file synchronously--which is blocking


// writeFileSync(resolvedPAth, `some code you're writing`)

const fsModule = () => {



  const data = fs.readFileSync(resolvedPath);
    console.log(data);
  }




// Read file asynchronously

// const fsModule =() => {
// fs.readFile(resolvedPath, 'utf8', (err, data) => {
//   if (err) {
//     console.error('Error reading file:', err);
//     return;
//   }
//   console.log('File contents:');
//   console.log(data);
// });
// }
fsModule();