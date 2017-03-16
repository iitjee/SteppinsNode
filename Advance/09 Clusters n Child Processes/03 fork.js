The fork function is a variation on the spawn function for spawning node processes.

The biggest difference between spawn and fork is that a communication channel is established to the child process when using 
fork. So we can use the 'send' method on the forked process and the global process object to exchange messages between the 
parent and forked processes with an interface similar to that of the EventEmitter module. 

(in parent.js)
      const { fork } = require('child_process');
      const forked = fork('mychildfile.js');

      forked.on('message', (msg) => { //listening for 'message' event of forked object
        console.log('Message from child', msg);
      });

      forked.send({ hello: 'world'}); //triggers 'message' event in mychildfile

(in mychildfile.js)
      process.on('message', (msg) => { //listening for 'message' event of global process object (which is its parent)
        console.log('Message from parent: ', msg);
      });

      let counter = 0;

      setInterval(() => {
        process.send({counter: counter++}); //triggers message in parent.js
      }, 1000);

$node parent.js
When running this code, the forked child will send an incremented counter value every second and the parent will just print 
that.


Let's do a more practical example to using the fork function. Let's say we have an http server that handles multiple 
endpoints. One of these endpoints is computationally expensive and will take few seconds to complete. I've simulated this with 
a long for loop here.



      const http = require('http');

      const longComputation = () => {
        let sum = 0;
        for(let i=0; i < 1e9; i++) 
          sum += i;

        return sum;
      };

      const server = http.createServer();

      server.on('request', (req, res) => {
        if(req.url === '/compute') {
          const sum = longComputation();
          return res.end(`Sum is ${sum}`);
        } else {
          res.end('Ok')
        }
      })

      server.listen(3000);
      
