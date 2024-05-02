const express = require('express');

// Creates an instance of Express
const app = express();

// Define a route
app.get('/v1', (req, res) => {
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