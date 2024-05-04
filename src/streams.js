const {createReadStream} = require('fs')
const path = require('path')

const resolvedPath = path.resolve(__dirname, 'sampleDoc', 'bigFile.txt');


const stream = createReadStream(resolvedPath, {highWaterMark: 9000, encoding: 'utf8'});


stream.on('data', (result) => {
  console.log(result);
})

stream.on('error', (err) => {
  console.log(err);
})

//you'll notice its reading everything in chunks