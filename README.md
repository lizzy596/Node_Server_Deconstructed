# **2. Node server with Express**

# **What is ExpressJS?**

Express is a webframework for Node.js (NodeJS is the language, Express is node)

**Express is a routing and middleware framework, it is essentially a series of middleware function calls. Middleware allows us to affect the req and resp objects**

REQ ---MIDDLEWARE--->RES

For express, **a middleware function is any function that has access to the req, res, and next object**

**next() - if you call this it tells express i want to hand control off to the next piece of middleware in the chain. If you don't call next() you have terminated the cycle and no other middleware will run.** 

This is a very basic Node REST server using Express.

We have created an Express instance in our app.js file, and setup two routes a GET and POST.
We will not be able to parse json responses at this time for our POST route.
Remember that a server is a listening to requests on a port.

app.listen() in Express is like telling your app to start listening for visitors on a specific address and port, 
much like how Node listens for connections. The app, created by `express()`, is just a handy function that handles different types of requests, 
making it easy to serve both HTTP and HTTPS versions of your app without extra complexity.

this is what gives us the req.body property on the request object
app.use(express.json());


res.send() -> auto sets the mime type as text/html
res.json() -> auto sets the mime type as application/json

all is a method and takes 2 args 1. route 2. callback to run if the route is requested.

 app.all('*', (req, res) => {
Express handles the basic headers
  res.send(`<h1>This is the homepage</h1>`);
})


// app.use is how you mount middleware, it will be added accross the board to everything
// app.use(express.static(path.join(__dirname, ')));




We also added a yarn start script for development


**Summary**
-networking http and tcp/udp
-HTTP is: stateless, connectionless, flexible, 
-HTTP message: 
--start line
---req: GET /blog http/1.1
---res: http/1.1 200OK
--headers
---{key: value}
---content-type: text/html
---content-type: application/json
---cache-control: public, max-age=0
Date:Fri, 24 Aug 2019 15:23:58 GMT
--BlankLine
--body
--STUFF -HTML, 4k video (binary), image--
--next(): is a way to move the middleware forward
-express.json() express.urlencoded() --body parse
**REQUEST:**
req.ip -contains requesters ip
req.path -path
req.body -all the parsed data is put here
**RESPONSE:**
res.send(.end()) -> if you were gonna run a process but not send anything back you'd end the connection to
res.sendFile = send a file!
res.locals -is available -through the response cycle we can put something on it
res.json(jsonp) -> sends json back as application/json


The browser can only read JS HTTP and CSS. 

Server-side rending: is when the server returns the js/http/css every single time ex. wikipedia
API- SPA like react, vue etc, user hits server, the first time the server sends html/js/css and afterwards sends JSON back, and the DOM will change