// const { parentPort } = require('node:worker_threads');


// let j = 0;
// for (let i = 0; i < 6000000000; i++) {
//   j++
// }

// parentPort.postMessage(j)

const jobs = Array.from({length:100}, () => 1e9);

//creating a nested for loop

//grab the performance module
const tick = performance.now();

for (let job of jobs) {
  let count = 0;
  for(let i = 0; i < job; i++) {
    count++;
}
}

const tock = performance.now();

console.log(`Main thread took ${ tock - tick } ms`)