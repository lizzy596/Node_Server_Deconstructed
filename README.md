Chapter 2

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

Add the logic to create an instance of your database server in the connectDB.js


d. Added http-status package for status codes