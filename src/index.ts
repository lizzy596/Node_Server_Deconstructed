import config from './config/config.js';
import app from './app.js';
import mongoose from 'mongoose';


let server: any;

mongoose.connect(config.mongoose.url)
    .then(() => {
        console.log('Connected to MongoDB');
          server = app.listen(config.port, () => {
    console.log(`Listening to port ${config.port}`);
  });
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error.message);
      
        if (error.name === 'MongoNetworkError') {
            console.error('Network error occurred. Check your MongoDB server.');
        } else if (error.name === 'MongooseServerSelectionError') {
            console.error('Server selection error. Ensure'
                + ' MongoDB is running and accessible.');
        } else {
          console.error('An unexpected error occurred:', error);
        }
    });
 

const exitHandler = () => {
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error: string) => {
  console.log(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  if (server) {
    server.close();
  }
});
