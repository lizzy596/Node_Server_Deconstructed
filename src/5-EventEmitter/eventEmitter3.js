const events = require('events');
const net = require('net');
const channel = new events.EventEmitter();






channel.clients = {};
channel.subscriptions = {};
channel.on('join', function(id,clients) {
  this.clients[id] = client;
  this.subscriptions[id] = (senderId, message) => {
    if(id != senderId) { 
      this.clients[id].write(message);
    }
  };
  this.on('broadcast', this.subscriptions[id]);

});

const server = net.createServer(client => {
  const id = `${client.remoteAddress}: ${client.remotePort}`;
  channel.emit('join', id, client);
})





//console.log('CHANNEL: ' + JSON.stringify(channel));

//CHANNEL: {"_events":{},"_eventsCount":1,"clients":{},"subscriptions":{}}