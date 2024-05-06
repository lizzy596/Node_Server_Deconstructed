const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
const htmlPath = path.resolve(__dirname,  'node.html')
const imgPath = path.resolve(__dirname,  'node.png')
console.log('htmlPath', htmlPath)
  if(req.url === '/') {
    
   res.writeHead(200, {'content-type': 'text/html'})
   const homePageHTML = fs.readFileSync(htmlPath);
   console.log(homePageHTML);
   res.write('<h1>home page</h1>') 
   res.end()

  }
  else if (req.url === '/about') {

    //takes a status code and an object with the mime type
      res.writeHead(200, {'content-type': 'text/plain'})
      //writes out the body
      res.write('<h1>about page</h1>')
      //lets browser know we're ready to close the connection
      res.end()
    
  }
  else if (req.url === '/node.png') {
    res.writeHead(200, {'content-type': 'image/png'})
    const image = fs.readFileSync(imgPath)
    res.write(image)
    res.end()

  }
  else{
    res.writeHead(404, {'content-type': 'text/html'})
    res.write('<h1>page not found</h1>')
    res.end()
  }

})

server.listen(3000)