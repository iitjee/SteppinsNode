//right now all messages are echoed to everybody(every socket)
we dont want to echo to the person who sent the message

socket.on('data', data => {(
  Object.entries(sockets).forEach(([key, cs]) => { //cs = connected socket
    if(socket.id == key) return;
    cs.write(`bla bla`);
  });  
});


//Let's improve further by connecting to only those sockets which have given their names
  socket.on('data', data => {(
    if(!sockets[socket.id]) {
      socket.name = data.toString().trim();
      socket.write(`Welcome ${socket.name}! \n`);
      sockets[socket.id] = socket;
      return;
    }
    Object.entries(...)
    
    
//let's also dipslay timestamp
  function timestamp() {
      const now = new Date();
      return `${now.getHours()}  :  ${now.getMinutes()}`;
    }
//for serious timestamp handling, use a lightweight library called 'moment'
                            
                             
                    
