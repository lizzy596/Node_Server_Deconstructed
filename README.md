# **2. Node server with Express**

This is a very basic Node REST server using Express.

We have created an Express instance in our app.js file, and setup two routes a GET and POST.
We will not be able to parse json responses at this time for our POST route.
Remember that a server is a listening to requests on a port.

app.listen() in Express is like telling your app to start listening for visitors on a specific address and port, 
much like how Node listens for connections. The app, created by `express()`, is just a handy function that handles different types of requests, 
making it easy to serve both HTTP and HTTPS versions of your app without extra complexity.


We also added a yarn start script for development