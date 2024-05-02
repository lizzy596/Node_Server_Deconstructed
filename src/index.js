const app = require('./app');

// Define port number
const PORT = 3010;


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});