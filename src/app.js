const express = require('express');
const cors = require('cors');
const routes = require('./routes/v1');

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

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})







//export app
module.exports = app;