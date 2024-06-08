import express, { Express } from 'express';
import cors from 'cors';
import routes from './routes/v1/index.js';
import { errorHandler, errorConverter } from './config/middlewares/error.js';
import ClientError from './config/error/ClientError.js';
import session from 'express-session';
import connectMongoDBSession from 'connect-mongodb-session';
import cookieParser from 'cookie-parser'
import { v4 as genId } from 'uuid';
import { redisStore } from './config/store/redis.store.js';
import config from './config/config.js';


// Creates an instance of Express
const app: Express = express();
const MongoDBStore = connectMongoDBSession(session);

// parse json request body
app.use(express.json());
// // parse urlencoded request body (form data)
app.use(express.urlencoded({ extended: true }));

// enable cors
app.use(cors(config.cors));
//app.options('*', cors(config.cors));
// enable cors
// app.use(cors());
// app.options('*', cors());

app.use(cookieParser())
// app.use(session({
//   genid: function() {
//     return genId() 
//   },
//   store: redisStore,
//   secret: 'keyboardcat',
//   resave: false,
//   saveUninitialized: false,
//   cookie: { httpOnly: false, secure: false, sameSite: 'none', maxAge: 1000*60*60*24 }
// }))
// v1 api routes
app.use("/v1", routes);

//The 404 Route (ALWAYS Keep this as the last route)
app.use((_req, _res, next) => {
  next(ClientError.NotFound("Resource not found"));
});

app.use(errorConverter);
app.use(errorHandler);


export default app;
