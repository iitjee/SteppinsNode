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
endpoints. One of these endpoints is computationally expensive and will take few seconds to complete. I have simulated 
this with a long for loop here.



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
      

When the the /compute endpoint is requested, the server will not be able to handle any other requests because the event loop 
is busy with the long for loop operation. There are a few ways we can solve this problem depending on the nature of the long 
operation, but one solution that works for all operations is just to move the computational operation into another process 
using fork. 

//We'll make two files:
      (server.js)
            const http = require('http');
            const fork = require('child_process');

            const server = http.createServer();

            server.on('request', (req, res) => {
              if(req.url === '/compute') {
//                 const sum = longComputation();
//                 return res.end(`Sum is ${sum}`);
                    const compute = fork('compute.js');
                    compute.send('start'); //When we get a request, we'll send a message to the forked process to start 
                                                //processing.
                    compute.on('message', sum => {//listen to the message event on the forked process itself,
                          res.end(`response is ${sum}`);
              } else {
                res.end('Ok')
              }
            })

            server.listen(3000);

      (compute.js)

            const longComputation = () => {
              let sum = 0;
              for(let i=0; i < 1e9; i++) 
                sum += i;

              return sum;
            };

            process.on('message', (msg) => {
                  const sum = longComputation();
                  process.send(sum);
            });

$node server.js   $curl localhost:3000/compute  $curl localhost
(open 3 terminals)

/*
this code is, of course, limited by the number of processes we can fork, but when we execute this code now and request the 
long computation over http, the main server is not blocked at all and can take further requests, and when the computation is 
done, it's received normally as before. Node's cluster module, which we'll explore next, is based on this idea of child 
process forking and load balancing the requests among the many forks that we can create on any system.
*/
