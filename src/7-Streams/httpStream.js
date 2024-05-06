var http = require('http')
var fs = require('fs')
const path = require('path')
const resolvedPath = path.resolve(__dirname, '../', 'sampleFiles', 'bigFile.txt');

http
  .createServer(function (req, res) {
    const text = fs.readFileSync(resolvedPath, 'utf8')
    //res.end(text)
    const fileStream = fs.createReadStream(resolvedPath, 'utf8')
    fileStream.on('open', () => {
      fileStream.pipe(res)
    })
    fileStream.on('error', (err) => {
      res.end(err)
    })
  })
  .listen(3010)


  //pipe writes data


