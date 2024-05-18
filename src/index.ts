
import config from 'config/config.js';
import app from './app.js';
import connectDB from 'config/db/connectDB.js';





const start = async () => {

  try {
    

    await connectDB(config.mongoose.url);
    app.listen(config.port, () =>
      console.log(`Server is listening on port ${config.port}...`),
    );
  } catch (error) {
    console.log(error);
  }
};

start();
