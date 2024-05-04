const { readFile} = require('fs')
const path = require('path')


//LONG TASK 
// console.log('first task')
// console.time()
// for(let i = 0; i < 10000000000; i++) {
//   const word = 'dog'
//   console.log(word)
// }

// console.timeEnd()

// console.log('next task')
const resolvedPath = path.resolve(__dirname, 'sampleDoc',  'example.txt');
console.log('first task')
readFile(resolvedPath, 'utf-8', (err, result) => {
  if(err) {
    console.log(err)
    return
  }

  console.log(result)
  console.log('completed first task')
})

console.log('staring second task ')


// console.log('first task')
// setTimeout(() => {
//   console.log('second task')
// }, 0)

// console.log('third task')