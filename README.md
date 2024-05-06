# **2. Node server with Express**


Webframework for Node.js
NodeJS is the language
Express is node

Express is a routing and middleware framework, it is essentially a series of middleware function calls. Middleware allows us to affect the req and resp objects

REQ ---MIDDLEWARE--->RES

For express, a middleware function is any function that has access to the req, res, and next object

next() - if you call this it tells express i want to hand control off to the next piece of middleware in the chain. If you don't call next() you have terminated the cycle and no other middleware will run. 

This is a very basic Node REST server using Express.

We have created an Express instance in our app.js file, and setup two routes a GET and POST.
We will not be able to parse json responses at this time for our POST route.
Remember that a server is a listening to requests on a port.

app.listen() in Express is like telling your app to start listening for visitors on a specific address and port, 
much like how Node listens for connections. The app, created by `express()`, is just a handy function that handles different types of requests, 
making it easy to serve both HTTP and HTTPS versions of your app without extra complexity.

this is what gives us the req.body
app.use(express.json());


res.send() -> auto sets the mime type as text/html
res.json() -> auto sets the mime type as application/json




We also added a yarn start script for development