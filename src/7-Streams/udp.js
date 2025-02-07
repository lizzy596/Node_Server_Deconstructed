const dgram = require('dgram');

const client = dgram.createSocket('udp4');
const server = dgram.createSocket('udp4');

let  message = process.argv[2] || 'hey man';
message = Buffer(message);

server.on("message", function(msg) {
  process.stdout.write("Got Message: " + msg + "\n");
  process.exit();
}).bind(4109)

client.send(message, 4109, 'localhost', (err) => {
  if (err) console.error(err);
  else console.log('Message sent to server');
});


client.send(message)