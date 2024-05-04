const { readFile} = require('fs');
const path = require('path');


console.log('first task')

const resolvedPath = path.resolve(__dirname, 'sampleDoc', 'subFolder' , 'test.txt');


const getText = (path) => {
  return new Promise((resolve, reject) => {
    readFile(path, 'utf-8', (err, data) => {
      if(err) {
        reject(err)
        return
      } else {
        resolve(data)
      }
    })
  })

}

// getText(resolvedPath).then(result => console.log(result)).catch(err => console.log(err));


//await waits until the promise is resolved, wrap all of them in a try catch block


const start = async () => {
  const first = await getText(resolvedPath);
  console.log('first task complete', first);
}

start();



console.log('second task')