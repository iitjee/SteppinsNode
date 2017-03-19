The net module provides you with an asynchronous network wrapper. It contains functions for creating both servers and clients 
(called streams).

(http module vs net module: http://stackoverflow.com/questions/29869999/http-createserver-vs-net-createserver-in-node-js _
net module creates tcp server where http module creates http server.
 HTTP is on 7th layer of OSI whereas TCP is on 4th layer(Transmission layer). i.e HTTP is built on top of it
With HTTP server, you can identify whether http headers received are valid or not but you can't do directly with TCP.
TCP is more like a raw form. On top of it you can make your modules for other protocols like ftp, upd etc.
This chat server application doesn't need http headers stuff. So we use simple raw TCP protocol :)
Read the above link for sure!)
 
 
const server = require('net').createServer(); //creating server

server.on('connection', socket => { //registering a connection handler (cb)
  console.log('connection successful');
  socket.write('Welcome new client'); //socket is duplex stream i.e it is bot readable and writable
});

server.listen(8000, () => console.log('Server bound')); //listen to the 8000

// $node yournodefile.js
//open new terminal and $nc localhost 8000 //use netcat to connect to 8000 port of localhost

//You can type in messages in the nc terminal but we haven't any handler to use the incomeing data to the server form the netcat client

/* Inside 'connection' event callback */
  socket.on('data', data => {
    console.log('recevied data is ', data); //you get data in terms of buffer. (eg:  <Buffer 73 64 0a> ) so user can type in any language
    //console.log(`Recieved data is  ${data}`); //you get data like strings.(node assumes utf-8 encoding on the buffers)
   
    socket.write('client side: data is: ');
    socket.write(data, 'utf8'); //here, the write method on the socket assumes a utf-8 encoding here
  });


/* we can also set the encoding globally to the socket */
server.on('connection', socket => { 
  console.log('connection successful');
  socket.write('Welcome new client'); //socket is duplex stream i.e it is bot readable and writable
  
  socket.on('data', data => {
    console.log('recevied data is ', data); //you get data in utf8 now
    //console.log(`Recieved data is  ${data}`); //you get data like strings.(node assumes utf-8 encoding on the buffers)
   
    socket.write('client side: data is: ');
    socket.write(data)
  });
  
  socket.setEncoding('utf8'); //for this particular socket, all teh streams on this object will assume utf8 standard
});


/* Handling the Disconnect event  */
server.on('end', () => {
  console.log('Client disonnected');
}
          
//note that sockets are of type event-emitter. Tha's why you are able to use this 'event' pattern
          
          
/* You can also make your own socket ids and also keep track of other live sockets using the follwoing appraoch */
          let counter = 0;
          let sockets = {};
          
          //in server.on('connection'...)
          socket.id = counter++;
          sockets[socket.id] = socket;
          
          socket.on('data', data => {
            Object.entries(sockets).forEach(([, cs]) => {
              cs.write(`${socket.id} :: ${data}`);
            }
          });

          socket.on('end', () => {
            delete sockets[socket.id]; //when client is disconnected, remove his id from sockets array
            console.log('client discon');
          });
