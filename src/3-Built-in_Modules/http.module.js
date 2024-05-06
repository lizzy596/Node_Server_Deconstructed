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



// The http module in Node.js is a core module that provides functionality to create HTTP servers and make HTTP requests. Here are some key aspects of the http module:

//     HTTP Server: The http.createServer() method is used to create an HTTP server instance. This server can listen for HTTP requests on a specified port and handle those requests.

//     Request Handling: When a client sends an HTTP request to the server, the server emits a 'request' event. You can listen for this event and handle the incoming request using the provided request and response objects. The request object represents the incoming HTTP request, and the response object is used to send back the HTTP response.

//     Request Object: The request object contains information about the HTTP request, such as the request method (GET, POST, etc.), request URL, request headers, and request body (if any). You can access this information to process the request and generate an appropriate response.

//     Response Object: The response object allows you to send an HTTP response back to the client. You can set response headers, specify the status code (e.g., 200 for successful requests, 404 for not found), and send the response body.

//     Routing: While the http module itself does not provide built-in routing mechanisms, you can implement routing logic within your request handler function to determine how to handle different URLs and request methods.

//     Server Listening: After creating an HTTP server instance, you need to call the server.listen() method to start listening for incoming HTTP requests on a specific port. You can optionally specify a callback function to be executed once the server starts listening.

//     Client Requests: In addition to creating HTTP servers, the http module also provides functionality to make HTTP requests from Node.js. You can use the http.request() method to send HTTP requests to other servers and handle the responses asynchronously.

//     Keep-Alive Connections: The http module supports keep-alive connections by default, allowing multiple HTTP requests and responses to be sent over the same TCP connection, which can improve performance by reducing connection overhead.

//     HTTPS: While the http module handles plain HTTP communication, Node.js also provides the https module for creating HTTPS servers and making HTTPS requests, which involve encrypted communication over SSL/TLS.

// Overall, the http module is a fundamental part of building web servers and interacting with HTTP resources in Node.js applications. It provides a powerful and flexible API for handling HTTP communication both on the server and client side.