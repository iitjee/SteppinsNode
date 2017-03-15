
The fact that node runs in a single thread does not mean that we can't take advantage of multiple processes, and of course, 
 multiple machines as well. Using multiple processes is the only way to scale a Node.js application. Node.js is designed for 
 building distributed applications with many nodes. This is why it's named Node.js. Scalability is baked into the platform and 
 it's not something you start thinking about later in the lifetime of an application.
 
 There are mainly three things we can do to scale an application. 
 
 The easiest thing to do to scale a big application is to clone it multiple times and have each cloned instance handle part of
 the workload. This does not cost a lot in term of  development time and it's highly effective. We will focus on the cloning 
 strategy. 
 
 But we can also scale an application by decomposing it based on functionalities and services. This means having multiple, 
 different applications with different code bases and sometimes with their own dedicated databases and User Interfaces. 
 This strategy is commonly associated with the term microservice, where micro indicates that those services should be as 
 small as possible, but in reality the size of the service is not what's important, but rather the enforcement of loose 
 coupling and high cohesion between services. The implementation of this strategy is often not easy and could result in
 long-term unexpected problems, but when done right the advantages are great. 
 
 The third scaling strategy is to split the application into multiple instances where each instance is 
 responsible for only a portion of the application's data. This strategy is often named horizontal partitioning, or sharding, 
 in databases. Data partitioning requires a lookup step before each operation to determine which instance of the application 
 to use. For example, maybe we want to partition our users based on their country or language. We need to do a lookup of that 
 information first. 
 
 Successfully scaling a big application should eventually implement all three strategies, and Node.js makes 
 it easy to do so. In the next few clips, we'll talk about the built-in tools available in Node.js to implement the cloning 
 strategy.



We can easily spin a child process using the child_process node modules, and those child processes can easily communicate with 
 each other with a messaging system. The child_process module enables us to access Operating system functionalities by running 
 any system command inside a child process, control its input stream, and listen in on its output stream. We can control the 
 arguments to pass to the command and we can do whatever we want with its output. 
 
 We can, for example, pipe the output of one command to another command, as all inputs and outputs of these commands can be 
presented to us using Node streams.
 
 There are four different ways we can use to create a child process in Node.
 
 ![image](https://cloud.githubusercontent.com/assets/20602254/23902855/8ef8ed1a-08e8-11e7-99a0-034d2729d06d.png)

 
 The spawn method launches a command in a new process and we can use it to pass that command any arguments.

 ```
 const { spawn } = require('child-process');
 const child = spawn('pwd');
 
 child.on('exit', (code, signal) => {
   console.log('child process exited with code: ${code} and signal: ${signal}`);
 }  
 ```
  other events are 'disconnect', 'error', 'message' and 'close' (https://nodejs.org/api/child_process.html)


 The disconnect event is triggered when the parent process manually calls the child.disconnect method. An error event is triggered if the process could not be spawned or killed. The message event is the most important one. It's triggered when the child process uses the process.send() method to send messages. This is how parent/child processes can communicate with each other.
 
 And finally, the close event is emitted when the stdio streams of a child process get closed. Every child process gets the three standard stdio streams, which we can access using child.stdin, child.stdout, and child.stderr.<b> When those streams get closed, the child process that was using them will trigger the close event. </b> This close event is different than the exit event, because multiple child processes might share the same stdio streams, and a child process exiting does not mean the streams got closed.
 
 'close' event !== 'exit' event
 
 Since all streams are event emitter, we can listen to different events on those streams attached to every child process. 
 Unlike in a normal process though, in a child process, the stdout/stderr streams are readable streams while the stdin stream 
 is a writable one, which is the inverse of those types as found in a normal process. The events we can use for those streams 
 are the standard ones. Most importantly, on the readable streams we can listen to the data event, which will have the output 
 of the command or any error encountered while executing the command. 

 
 
 When we execute this script, the output of the pwd command gets printed and the child process exits with code 0, which means 
 no error occurred.
 
 We can pass the spawn command any argument using the second argument of the spawn function, which is an array of all the 
 arguments to be passed to the command. For example, to execute the find command on the current directory with a -type f 
 argument (to list files only), we pass these three strings as values to the array here and this will be equivalent to 
 executing the command find.-type f, which will list all the files in all directories under the current one. If an error 
 occurs in the execution of the command, for example, if we can find an invalid destination here, we get the stderr line to 
 trigger and the exit event will report an exit code of 1, which signifies that an error has occurred. The error value here 
 depends on the operating system and the type of error. 
 
 A child process stdin is a writable stream. We can use it to send a command some input. Just like any writable stream, the 
 easiest way to consume it is using the pipe function. We pipe a readable stream into a writable stream. Since the top level 
 process stdin is a readable stream, we can pipe that into a child process stdin stream.
 ```
       const { spawn } = require('child_process'); //(or) const spawn = require('child_process').spawn;
       const child = spawn('wc'); //word-count command
       
//The result of the spawn function is a ChildProcess instance, which implements Node.js EventEmitter API. This means we can 
//register handlers for events on this child object directly.

       process.stdin.pipe(child.stdin); //piping toplevel stdin's data to child's stdin stream

       child.stdout.on('data', (data) => {
       console.log(`child stdout \n ${data}`);
       }
 ```
 The result of this combination is that we get a standard input mode where we can type something, and when we hit Ctrl D, what 
 we typed will be used as the input of the wc command and we got 1 line, 2 words, and 12 characters here.
 
 We can pipe the standard input output of multiple processes on each other, just like we can do with Linux commands. 
 const {spawn} = require('spawn');
 ```
       const find = spawn('find', ['.', '-type', 'f']);
       const ws = spawn('wc', ['-l']);

       find.stdout.pipe(wc.stdin); //piping find's stdout's data into wc's stdin

       wc.stdout.on('data', (data) => {
        console.log(`Number of files  ${data}`);
      }
```
Executing this script here will give us a count of all files in all directories under the current one.  

