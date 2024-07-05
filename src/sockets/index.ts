import server from './server.js';



const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Socket server listening on port ${PORT}`);
});


// const mongoose = require('mongoose');
// const server = require('./server');
// const config = require('../config/config');
// const logger = require('../config/logger');

// mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
//   logger.info('SOCKET Connected to MongoDB');
//   server.listen(config.socketPort, () => {
//     logger.info(`TCP Socket Listening to port ${config.socketPort}`);
//   });
// });

// const exitHandler = () => {
//   if (server) {
//     server.close(() => {
//       logger.info('Socket Server closed');
//       process.exit(1);
//     });
//   } else {
//     process.exit(1);
//   }
// };

// const unexpectedErrorHandler = (error) => {
//   logger.error(error);
//   exitHandler();
// };

// process.on('uncaughtException', unexpectedErrorHandler);
// process.on('unhandledRejection', unexpectedErrorHandler);

// process.on('SIGTERM', () => {
//   logger.info('SOCKET SIGTERM received');
//   if (server) {
//     server.close();
//   }
// });