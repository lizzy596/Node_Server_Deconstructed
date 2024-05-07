const express = require('express');

// Creates an instance of Express- an "app" is the express function createApplication inside the express module invoked and is an express application
const app = express();


//This middleware calls next()
function validateUser(req, res, next) {
  res.locals.validated = true;
  console.log('my validate middleware is running')
  next()
  }

  //this middleware DOESNOT call next()
  function stopTheChain (req, res, next) {
    console.log('I Want to prove the chain will stop here since I do not call next')
    //next()
    }
  
  // this will run the validateUser middleware on every request
  app.use(validateUser)

  app.use(stopTheChain);




// Define a route

//Note that when we DONT call next() this is the end of the cycle, no more middleware will run and the GET route will not be hit
app.get('/v1', (req, res) => {
  console.log(res.locals.validated)
  console.log('i am hiting my route')
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