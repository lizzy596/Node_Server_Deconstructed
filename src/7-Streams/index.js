const CountStream = require('./streams.book.js')
const countStream = new CountStream('book');
const http = require('http');


http.get('http://www.manning.com', function(res){
  console.log('response', res)
  res.pipe(countStream);
})


countStream.on('total', function(count) {
console.log('Total matches: ' + count)
})