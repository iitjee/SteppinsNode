
//SERVER
const dgram = require("dgram");
const server = dgram.createSocket('udp4');

const PORT = 8000;
const HOST = '127.0.0.1';
server.bind(PORT, HOST);

//server is an instance of event emitter. so we can register for few events

//before const PORT = 8000;
server.on('listening', () => {
  var address = server.address();
  console.log(`server listening ${address.address}:${address.port}`);
});

server.on('message', (msg, rinfo) => { //whenever socket gets a message   rinfo=remoteInfo=details of client
  console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
});




//Let's create the client in the same file
//CLIENT
    const client = dgram.createSocket('udp4');
    client.send('Github is awesome', PORT, HOST, (err) => { //here (PORT, HOST) are those to send the message to
    //note that the first three are the arguments to client.send. the last (err) is the only argument to cb

    console.log('UDP message sent');

      client.close();
    });
    
/* Note that everytime you create a new socket, it will use a different port */
   setInterval(function () {
       const client = dgram.createSocket('udp4');
        client.send('Github is awesome', PORT, HOST, (err) => { //here (PORT, HOST) are those to send the message to
        //note that the first three are the arguments to client.send. the last (err) is the only argument to cb

        console.log('UDP message sent');

          client.close();
        }
   }, 5000)
   //note in terminal for ``server got: ${msg} from ${rinfo.address}:${rinfo.port}``
   
   
   
   
   
   /* Messages */
//messages can also be buffers
const message = Buffer.from('Github is Awesomeee');
const client = dgram.createSocket('udp4');

client.send(message, 41234, 'localhost', (err) => {
  client.close();
});

//same as
client.send(message, 0, message.length, 41234, 'localhost', (err) => {
  client.close();
});

//or you can send in packets
client.send(message, 0, 11,  41234, 'localhost', (err) => {
  console.log(`UDP message sent`);

  client.send(message, 11, 15,  41234, 'localhost', (err) => {
    console.log(`UDP message sent`);
  });
    client.close();
});

//or you can have an array of messages if you want to send multiple things
    client.send([buf1, buf2], 41234, 'localhost', (err) => {
      client.close();
    });
