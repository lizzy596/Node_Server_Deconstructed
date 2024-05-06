const {createReadStream} = require('fs')
const path = require('path')

const resolvedPath = path.resolve(__dirname, '../', 'sampleFiles', 'bigFile.txt');

// The highWaterMark option is a threshold, not a limit: 
// it dictates the amount of data that a stream buffers before it stops asking for more data.

const stream = createReadStream(resolvedPath, {highWaterMark: 9000, encoding: 'utf8'});


stream.on('data', (result) => {
  console.log(result);
})

stream.on('error', (err) => {
  console.log(err);
})

//you'll notice its reading everything in chunks


// Streams are a fundamental concept in Node.js that enable efficient processing of data, especially when dealing with large amounts of data or when working with data sources that arrive incrementally, like network connections or file system operations. Streams provide an abstract interface for working with data flow, allowing you to read from or write to data sources in a sequential and efficient manner.

// Here are the key components of streams in Node.js:

//     Readable Streams: Readable streams represent a source from which data can be read. Examples include reading data from a file, receiving data from an HTTP request, or generating data with a function. Readable streams emit events such as data, end, and error, allowing you to consume the data they provide.

//     Writable Streams: Writable streams represent a destination to which data can be written. Examples include writing data to a file, sending data over an HTTP response, or processing data with a transform stream. Writable streams provide methods like write() and end() for writing data, and they emit events like drain and error.

//     Duplex Streams: Duplex streams represent both a readable and writable stream. They allow bidirectional data flow, enabling processes like client-server communication or file manipulation.

//     Transform Streams: Transform streams are a special type of duplex stream that allows data to be modified as it's being read from a readable stream and written to a writable stream. They're commonly used for tasks like compression, encryption, or data transformation.