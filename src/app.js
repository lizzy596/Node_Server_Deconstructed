const express = require('express');

// Creates an instance of Express- an "app" is the express function createApplication inside the express module invoked and is an express application
const app = express();

function validateUser(req, res, next) {
  res.locals.validated = true;
  console.log('my validate middleware is running')
  next()
  }
  
  // this will run the validateUser middleware on every request
  app.use(validateUser)


//all is a method and takes 2 args 1. route 2. callback to run if the route is requested.


// app.all('*', (req, res) => {
//   // Express handles the basic headers
//   res.send(`<h1>This is the homepage</h1>`);
// })


// app.use is how you mount middleware, it will be added accross the board to everything
// app.use(express.static(path.join(__dirname, ')

// Define a route



//we dont call next() here so this is the end of the cycle, no more middleware will run
app.get('/v1', (req, res) => {
  console.log(res.locals.validated)
  res.send('Hello, World!');
});

// Per Express Documentation: 
// The req.body property contains key-value pairs of data submitted in 
// The request body. By default, it is undefined and is populated when
// You use a middleware called body-parsing such as express.urlencoded() or express.json(). 


//.A. WHAT ERROR WILL YOU HAVE HERE?

// app.post('/v1', (req, res) => {
//   const { message } = req.body;
//   console.log('req', req.body);
//   res.send(`We received your ${message}`);
//  })



 app.post('/v1', (req, res) => {
 res.send('You hit our endpoint!');
 })







//export app
module.exports = app;