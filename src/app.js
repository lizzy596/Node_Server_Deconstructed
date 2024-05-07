const express = require('express');
const cors = require('cors');
const routes = require('./routes/v1');
const {errorHandler, errorConverter} = require('./config/middlewares/error');

// Creates an instance of Express
const app = express();

// parse json request body
app.use(express.json());
// // parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// enable cors
app.use(cors());
app.options('*', cors());

// v1 api routes
app.use('/v1', routes);


app.use(errorConverter);
app.use(errorHandler);

//Express will handle synchronous errors automatically
// app.get('/', (req, res, next) => {
//   try {
//       throw new Error("Hello error!")
//   }
//   catch (error) {
//       next(error)
//   }
// })


//express cannot handle asynchronous errors unless they're passed to next(), without the error handling middleware, the app will crash

// app.get('/', (req, res, next) => {
//   setTimeout(() => {
//       console.log("Async code example.")
//       throw new Error("Hello Error!")
//   }, 1000)

// })

// For handling errors raised during asynchronous code execution 
// , developers need to themselves catch their errors and invoke the in-built error handler middleware using the next() function. 



// app.get('/', (req, res, next) => {
//   setTimeout(() => {
//       try {
//           console.log("Async code example.")
//           throw new Error("Hello Error!")
//       } catch (error) { // manually catching
//           next(error) // passing to default middleware error handler
//       }
//   }, 1000)
// })


//How to Handle Errors with Promises


// const fsPromises = require('fs').promises
// app.get('/', (req, res, next) => {
//   fsPromises.readFile('./no-such-file.txt')

//      .then(data => res.send(data))

//      .catch(err => next(err)) 
// })


// app.use((err, req, res, next) => {
//   //console.error(err.stack)
//   res.status(500).send('Something broke!')
// })

//CODE EXAMPLE

// function errorLogger(error, req, res, next) { // for logging errors
//   console.error(error) // or using any fancy logging library
//   next(error) // forward to next middleware
// }

// function errorResponder(error, req, res, next) { // responding to client
//   if (error.type == 'redirect')
//       res.redirect('/error')
//   else if (error.type == 'time-out') // arbitrary condition check
//       res.status(408).send(error)
//   else
//       next(error) // forwarding exceptional case to fail-safe middleware
// }

// function failSafeHandler(error, req, res, next) { // generic handler
//   res.status(500).send(error)
// }

// app.use(errorLogger)
// app.use(errorResponder)
// app.use(failSafeHandler)






//export app
module.exports = app;