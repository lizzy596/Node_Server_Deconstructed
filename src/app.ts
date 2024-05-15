import express, { Express } from 'express';
import cors from 'cors';
import routes from './routes/v1/index.js';
import { errorHandler, errorConverter } from './config/middlewares/error.js';
import ClientError from './config/error/ClientError.js';


// Creates an instance of Express
const app: Express = express();

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
app.use((_req, _res, next) => {
  next(ClientError.NotFound("Resource not found"));
});

app.use(errorConverter);
app.use(errorHandler);


export default app;
