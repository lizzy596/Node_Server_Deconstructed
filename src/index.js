require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/DB/connectDB');

// Define port number
const port = process.env.PORT || 5000;

let server;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    server = app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();




