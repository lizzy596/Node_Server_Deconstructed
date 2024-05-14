const express = require("express");
const cors = require("cors");
const routes = require("./routes/v1");
const { errorHandler, errorConverter } = require("./config/middlewares/error");
const ClientError = require("./config/error/ClientError");

// Creates an instance of Express
const app = express();

// parse json request body
app.use(express.json());
// // parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// enable cors
app.use(cors());
app.options("*", cors());

// v1 api routes
app.use("/v1", routes);

//The 404 Route (ALWAYS Keep this as the last route)
app.use((req, res, next) => {
  next(ClientError.NotFound("Resource not found"));
});

app.use(errorConverter);
app.use(errorHandler);

//export app
module.exports = app;
