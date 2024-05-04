const http = require('http');

const port = 3000;
const host = 'localhost';


// Create a server object
const server = http.createServer((req, res) => {
 if(req.url === '/') {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('welcome to our home page')

 }
 if(req.url === '/about') {
  res.end('About Page');
 }
//if nav to page that doesnt exist
 res.end(`<h1>page not found</h1>`)


});

//server just continues to listen

server.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}/`);
});
