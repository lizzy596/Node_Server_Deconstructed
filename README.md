# **2. Node server with Express**

# **What is ExpressJS?**

Express is a webframework for Node.js (NodeJS is the language, Express is node) The framework comes with a generator tool, express-generator, that can be used to quickly generate a skeleton of an application. 

The Express middlewares are everywhere. Express middlewares are functions that get called by the Express routing layer and allow to execute code between the initial request and the code from the destination route. That is why they are called middlewares.

In short, middlewares are functions that have access to Express’ request and response objects and apply modifications to them. 

**Express is a routing and middleware framework, it is essentially a series of middleware function calls. Middleware allows us to affect the req and resp objects**

REQ ---MIDDLEWARE--->RES

For express, **a middleware function is any function that has access to the req, res, and next object**

**next() - if you call this it tells express i want to hand control off to the next piece of middleware in the chain. If you don't call next() you have terminated the cycle and no other middleware will run.** 

This is a very basic Node REST server using Express.

We have created an Express instance in our app.js file, and setup two routes a GET and POST.
We will not be able to parse json responses at this time for our POST route.
Remember that a server is listening to requests on a port.

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


# **Request and Response**

Forms come through to the server as urlencoded. Gives the request a .body property
Sessions and Cookies are very similar, cookie data is stored entirely on the browser, and the browser will send it the server every time a request is made.
Session data is stored on the server, and the browser is given a key for that data.
res.cookie(nameOfCookie, valueSettingitToo)
once stored on a cookie you can access this information anywhere
To parse the info on the cookie you will need to use cookieParser


The query string is where you put insecure data.

Getting data from params: in a route, anytime something has a : in front of it, it is a wildcard. the req.params object always exists, it will have a property for each wildcard in the route
ex. req.params.storyId

Headers already sent, means you've already sent some response to the client
res.headersSent is a boolean that tells you if they've already been sent

**The Router**

express.Router() --its only job is to handle middleware and to handle routes. It treats routes like individual microservices and is a very modular approach to routing, allowing you to apply middleware in a discrimating fashion to the routes that need it.

The Express Generator

yarn add express-generator global--will generate a boilerplate express app.


HTTP Headers

When you: res.json, res.send, res.send, res.sendFile, res.download, res.redirect you are NOT sending a webpage, or json or a file etc. You are sending an http message. that is what express does. Which s the start line and then the headers and then the blank line and then the body. 

res.set is how you set the headers.

HTTP headers are an essential part of the HTTP protocol, which is the foundation of data communication on the web. They are key-value pairs sent in the request or response messages, providing essential information about the request or the response, or about the object sent in the message body.
Categories of HTTP Headers

    Request Headers: Sent by the client to provide information about the request.
    Response Headers: Sent by the server to provide information about the response.
    General Headers: Apply to both request and response messages.
    Entity Headers: Contain information about the body of the resource, such as its length or MIME type.

Common HTTP Headers
General Headers

    Cache-Control: Directives for caching mechanisms in both requests and responses.
    Connection: Control options for the current connection. For example, keep-alive or close.
    Date: The date and time at which the message was originated.

Request Headers

    Accept: Informs the server about the types of data the client can process. Example: Accept: text/html.
    Accept-Encoding: Informs the server about the encoding algorithms the client can handle. Example: Accept-Encoding: gzip, deflate.
    Authorization: Contains credentials for authenticating the client to the server. Example: Authorization: Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ==.
    Cookie: Contains stored HTTP cookies previously sent by the server. Example: Cookie: sessionId=abc123.
    User-Agent: Information about the client software initiating the request. Example: User-Agent: Mozilla/5.0.

Response Headers

    Access-Control-Allow-Origin: Specifies which origins are allowed to access the resource. Example: Access-Control-Allow-Origin: *.
    Content-Type: Indicates the media type of the resource. Example: Content-Type: application/json.
    Set-Cookie: Used by the server to send cookies to the client. Example: Set-Cookie: sessionId=abc123; Path=/; HttpOnly.
    Server: Contains information about the software used by the origin server to handle the request. Example: Server: Apache/2.4.1 (Unix).

Entity Headers

    Content-Encoding: The type of encoding used on the data. Example: Content-Encoding: gzip.
    Content-Length: The size of the response body in bytes. Example: Content-Length: 348.
    Content-Type: The MIME type of the body of the request or response. Example: Content-Type: text/html; charset=UTF-8.

How HTTP Headers Work

When a client sends an HTTP request to a server, it includes various request headers that provide information about the request and the client. The server then processes the request and sends back an HTTP response, which includes response headers with information about the response and the server.

Importance of HTTP Headers

    Security: Headers like Authorization, Set-Cookie, and Strict-Transport-Security (HSTS) help in maintaining security.
    Performance: Headers such as Cache-Control and Content-Encoding improve the performance by controlling caching and compression.
    Content Negotiation: Headers like Accept, Accept-Language, and Content-Type are crucial for content negotiation, allowing the server to serve content in the format preferred by the client.
    Cross-Origin Resource Sharing (CORS): Headers like Access-Control-Allow-Origin enable cross-domain communication in web applications.


-Using gzip compression is always a best practice on a Node.js application. The Express frameworks recommends to use the NPM package compression as middleware to handle the compression process.

-Do not use synchronous functions unless those methods are required for the initial setup. Asynchronous methods need to be used to ensure maximum performance of the app. Node.js 4.0+ exposes the command-line flag --trace-sync-io -- to print a warning whenever your application uses a synchronous API.

-Activity logging is another important topic on any production application. NPM libraries like Winston or Bunyan are suggested by the Express framework as recommended approach to logging. They ensure asynchronous performance and facilitate the writing of logs to single commands like: winston.log('info', 'Hello distributed log files!');

-Node application might crash. That is why it is very important to handle exceptions properly and prevent a production application to go offline. The use of a process manager such as PM2 is going to simply administration tasks and ensure an Express application runs 24/7. To prevent application crashes is important to implement try-catch or promise rejection techniques in the code.

-The use of Linting tools is also highly recommended. A Lint process is going to analyse your source code and highlight potential errors on the writing. JSHint or JSLint are some tooling examples.

--Another recommended approach is to use environment variables. This are configurations tied to the environment where an application is running to. Ports where an application listens to, paths and folders accessed on the code or database logins are examples of environment variables. 

-As all frameworks, keeping an eye on updates is important. For instance, Express2.x and Express 3.x are outdated version that shouldn’t be used in production. Checking the Security Updates is highly recommended as it keeps a log track of security vulnerabilities of each version.

-When transferring sensitive data, it is highly recommended to use Transport Layer Security (TLS) to secure the connection. Encryption of the information is important to prevent packet sniffing attacks.

-The Express team recommends reviewing the Headers that are returned by a running application. The use of Helmet can prevent some well-known web vulnerabilities by setting or removing some HTTP headers. For example, the X-Powered-By header can expose the engine behind your application leading attackers to a clue about your application.

-A correct handling of cookies is also a best practice in terms of security. The Express framework exposes two middlewares which can be used: express-session and cookie-session. The following cookie options are recommended to increase security: secure, httpOnly, domain, path and expires.

-Another important topic related to security is protection of brute-force attacks against authorization endpoints. An effective way to block them is to use metrics for consecutive failed attempts by same user and IP address. As an example, block any request from an IP address if it makes 100 failed attempts in a single day. The open source node-rate-limiter-flexible library is a great tool for preventing DDoS and brute force attacks.

-Finally, the Express team highlights the importance of keeping all application dependencies secure. The use of NPM to manage dependencies is a very powerful, but it also can lead to a security breach. The use of tools like Snyk allow a fastest detection of dependencies vulnerabilities.