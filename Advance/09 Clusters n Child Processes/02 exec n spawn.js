/*
By default, the spawn method does not create a shell to execute the command we passed into it, making it slightly more 
efficient than the exec method, which does create a shell. The exec method has one other major difference. It buffers the 
command's generated output and pass the whole value to a callback function. 
*/

//Here's our previous example implemented with an exec method. Since exec uses a shell to execute the command, we 
//can use the shell syntax directly here making use of the shell pipe feature. 
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

//Here's an example to spawn the same find command, but inherit the process stdin stdout and stderr
   const { spawn } = require('child_process');

   const child = spawn('find', ['.', '-type', 'f'], {
     stdio: 'inherit' //inherits the process 'stdout', 'stdin' and 'stderr'
   });

So when we execute this command, the data event will be triggered on the process.stdout, making the script output the result 
right away.

If we want to use shell syntax and still get advantage of the streaming of the data that the spawn command give 
us, we can also use the shell option and set that it true. This way spawn will use a shell, but it will still not buffer the 
data the way exec does. This is the best of the two worlds. 
            const child = spawn('find . -type f | wc -l', { //note the format of bash command now
                 stdio: 'inherit',
                 shell : true
               });


There are few other options which we can use
        const child = spawn('find . -type f | wc -l', { 
                         stdio: 'inherit',
                         shell : true,
                         cwd : './path/to/dir' //to change the working directory
                       });


One other option we can use is the env option to specify environment variables that will be visible to the new process.
The default for this option is process.env itself. So any command will have access to the current process environment by 
default, 

                 //1
                const child = spawn('echo $HOME', { //$HOME is a predefined env var in 'process.env' process which prints pwd
                  stdio: 'inherit',
                  shell: true,
                  });
and if we want to override that behavior we can simply pass an empty object in the env option, and now the command will not 
have access to the parent process env object anymore.
                 //2
                const child = spawn('echo $HOME', {
                                  stdio: 'inherit',
                                  shell: true,
                                  env: {} //
                                  });

                //3
                const child = spawn('echo $ANSWER', {
                                  stdio: 'inherit',
                                  shell: true,
                                  env: { ANSWER: 42 } //you can manually define your own environment vars
                                  });

 The last option I want to explain here is the detached option, which makes the child process run independently of its parent process, but the exact behavior depends on the OS.
 
 On Windows, the detached child process will have its own console window, while on Linux the detached child process will be made the leader of a new process group and session.

.....still there
 If the unref method is called on the detached process, the parent process can exit independently of the child. This can be 
 useful if the child is executing a long running process, but to keep it running in the background the child's stdio 
configurations also have to be independent of the parent. 

        const child = spawn('node', ['timer.js'], {
          detached: true,
          stdio: 'ignore'
        });

This example will run a node script in the background by detaching and also ignoring its parent stdio file descriptors, so 
that the parent can terminate while the child keeps running in the background. When we run this, the parent process will exit, 
    but the timer.js process will continue to run in the background. If you need to execute a file without using a shell, the 
exec file function is what you need. It behaves exactly like the exec function, but does not use a shell, which makes it a bit 
more efficient. But behaviors like io direction and file clobbing are not supported when using exec file. On Windows also, 
    some files cannot be executed on their own, like .bat or .cmd files. Those files cannot be executed with exec file, and 
either exec or spawn with shell set to true is required to execute them. All of the child_process module functions have 
synchronous blocking versions that will wait until the spawned process exits. This is potentially useful for simplifying 
scripting tasks or any startup processing tasks, but they are to be avoided otherwise.
