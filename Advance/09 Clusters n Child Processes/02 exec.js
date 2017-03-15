/*
By default, the spawn method does not create a shell to execute the command we passed into it, making it slightly more 
efficient than the exec method, which does create a shell. The exec method has one other major difference. It buffers the 
command's generated output and pass the whole value to a callback function. 
*/
Here's our previous example implemented with an exec method. Since exec uses a shell to execute the command, we can use the shell syntax directly here making use of the shell pipe feature. 
 const {exec} = require('child_process');
 
 exec('find. -type f | wc -l', (err, stdout, stderr) => {
   if(err) {
     console.error(`exec error:  ${err}`);
     return;
   }
   
   console.log(`Number of files :  ${stdout}`);
 });
     
//Exec buffers the output and pass it here in the stdout argument to the callback, which is the output we want to print.

Exec is a good choice if you need to use the shell syntax and the data returned from the command is not big, because exec will 
buffer the whole data before it returns it. The spawn function is a much better choice when the data returned from the command 
is big, because that data will be streamed with the standard I/O object and we can actually make the child process inherit the 
standard io objects of its parents if we want to. 

Here's an example to spawn the same find command, but inherit the process stdin stdout and stderr
const { spawn } = require('child_process');

const child = spawn('find', ['.', '-type', 'f'], {
  stdio: 'inherit'
});

So when we execute this command, the data event will be triggered on the process.stdout, making the script output the result 
right away. If we want to use shell syntax and still get advantage of the streaming of the data that the spawn command give 
us, we can also use the shell option and set that it true. This way spawn will use a shell, but it will still not buffer the 
data the way exec does. This is the best of the two worlds. 

..still threre..
