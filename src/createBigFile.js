const { writeFileSync } = require('fs')
const path = require('path')

const resolvedPath = path.resolve(__dirname, 'sampleDoc', 'bigFile.txt');

for (let i = 0; i < 1000; i++) {
  writeFileSync(resolvedPath, `hello world ${i}\n`, { flag: 'a' })
}