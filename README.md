# **Chapter 2 Data Parsing and Persistence**


**express.urlencoded([options]):**--parsing from html forms,  where the form data is sent as key-value pairs in the body of the HTTP request. 

**express.json():** This middleware is used to parse incoming request bodies in JSON format. used when clients to send JSON data in the request body, such as in API requests. It parses the JSON data and populates the req.body object with the parsed data.


Difference between Sessions and Cookies:

Cookies are stored in the browser, and the browser will send it to the server everytime
a request is made. Sessions are stored on the server and the browser is given a key for that data.


Two Types of Data Sent via the Request URL:


**req.query** is an object with a property of every key in the query string

Query String: The "?" is a special delimiter in the url, everything before it is part of the url path, everything after it is part of the query string.
The query string is where you put data that can be seen publicly, you dont put private info in that, you'd put it in the body. Because people monitoring your internet traffic 
can see the query string.

'/login?msg=fail&test=hello'


**req.params** anytime something has a colon in front it is a wildcard, the wildcard will match anything in that slot, req.params object always exists, it will have a property for each
wildcard in the route.
'/story/:storyId'
(req.params.storyId)
'/story/:storyId/:link'
(req.params.storyId) -(req.params.link)


also note:

'/story:blogId'
'/story:storyId'
express sees both the routes as the same, so you will never each the storyId because blogId is listed first and will match for both
a. Cors

If you try to ping your GET route from a client, data will not load, you will get this error: Content-Security-Policy: The page’s settings blocked a JavaScript eval in your console.

Cross-Origin Resource Sharing (CORS) is an HTTP-header based mechanism that allows a server to indicate any origins (domain, scheme, or port) other than its own from which a browser should permit loading resources.

For security reasons, browsers restrict cross-origin HTTP requests initiated from scripts. For example, fetch() and XMLHttpRequest follow the same-origin policy. 

This means requests from the same origin are always allowed, but cross origin requests are controlled by cors.

b. Parsing JSON 

Express provides you with middleware to deal with the (incoming) data (object) in the body of the request.

1. express.json() is a method inbuilt in express to recognize the incoming Request Object as a JSON Object. This method is called as a middleware in your application using the code: app.use(express.json());

2. express.urlencoded() is a method inbuilt in express to recognize the incoming Request Object as strings or arrays. This method is called as a middleware in your application using the code: app.use(express.urlencoded());

The extended option allows to choose between parsing the URL-encoded data with the querystring library (when false ) or the qs library (when true ). The “extended” syntax allows for rich objects and arrays to be encoded into the URL-encoded format, allowing for a JSON-like experience with URL-encoded. url-encoded is form-data.


Basically Unless you're parsing json you will get undefined for all info posted to the server.


c. DATABASE

Added the logic to create an instance of your database server in the connectDB.js

d. MODULE

Added the module folder which will hold all of our models, routes, controllers, services etc by data unit


e. Added http-status package for status codes

