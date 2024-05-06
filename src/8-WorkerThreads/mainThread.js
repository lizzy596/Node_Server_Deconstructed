const http = require('http');
const { Worker } = require('node:worker_threads');
const workerThread = require('./workerThread');


// const server = http.createServer((req, res) => {
//   if(req.url === "/") {
//     res.writeHead(200, { "Content-Type": "text/plain" });
//     res.end("home page");
//   } else if (req.url === "/slow-page") {
//     let j = 0;
//     for (let i = 0; i < 6000000000; i++) {
//       j++
//     }


//   res.writeHead(200, { "Content-Type": "text/plain" });
//   res.end(`slow page ${j}`);

//   }


// });



const server = http.createServer((req, res) => {
  if(req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("home page");
  } else if (req.url === "/slow-page") {
    const worker = new Worker(workerThread);
    worker.on('message', (j) => {
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end(`slow page ${j}`);
    })
 }
});

server.listen(8000, () => console.log('server is running on port 8000'))