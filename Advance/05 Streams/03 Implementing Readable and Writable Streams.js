// Let's implement a writable stream. We need to use the Writable constructor from the stream module. We can implement a writable 
// stream in many ways. We can extend this Writable constructor if we want, but I prefer the simpler constructor approach.

const {Writable } = require('stream');

const outStream = new Writable ({
  write(chunk, encoding, callback) {
    console.log(chunk.toString());
    callback()
  }
});
/*We just create an object from the Writable constructor and we pass it a number of options. The only required option is a 
write function, which is what the streams uses to send data to the resource. This write method takes three arguments. The 
chunk is usually a buffer unless we configure the stream differently. The encoding argument is needed in that case, but 
usually we can ignore it. And the callback is what we need to call after we're done processing the data chunk. Let's simply 
console log the chunk as a string and call the callback after that. So this is a very simple and probably not so useful echo 
stream. Anything it receives it will echo back.
*/

/* To consume this stream, we can simply use it with process.stdin, which is a readable stream, so we can just pipe stdin into 
our outStream.*/
  process.stdin.pipe(outStream);
//When we run this file, anything we type into process.stdin will be echoed back using the outStream console.log line


// This is not a very useful stream to implement, because it's already implemented and built in. This is very much equivalent to 
// process.stdout. We can just pipe stdin into stdout and we'll get the exact same echo feature with just that line.
  process.stdin.pipe(process.stdout);


 Let's implement a readable stream. Similar to writable, we require the readable interface, construct an object from it, and for the readable stream we can simply push the data that we want the consumers to consume. When we push null, it means we want to signal that the stream does not have any more data. 
    const { Readable } = require('stream');
    const inStream = new Readable();
    
    inStream.push('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
    inStream.push(null);
    
    inStream.pipe(process.stdout);
    
// When we run this file, we're reading the data from this inStream and echoing it to standard out. Very simple, but also not 
// very efficient. We're basically pushing all our data to the stream before piping it to process.stdout. The better way here is 
// to push data on demand, when a consumer asks for it. We can do that by implementing the read method on the readable stream. 
    const inStream = new Readable({
      read(size) { //When the read method is called on a readable stream, the implementation can push partial data to the 
      //queue. 
        this.push(String.fromCharCode(this.currentCharCode++)); //While the consumer is reading, the read method will continue 
        //to fire, and we'll push more letters.
        if(this.currentCharCode > 90) this.push(null) //to stop after 'z', we push null
      }
    });

inStream.currentCharCode = 65; //Let's push one letter at a time
inStream.pipe(stdout);


 Let's delay this pushing code a bit to explain this further.
     const inStream = new Readable({
          read(size) {
            setTimeout(() => {
              this.push(String.fromCharCode(this.currentCharCode++));
            if(this.currentCharCode > 90) this.push(null);
          }, 100);
        });
        
//  If we execute this code, the stream will stream characters every 100 ms, and we'll get an error here, because we basically 
//  created a race condition where one timer will push null and another timer will try to push data after that. To fix that we 
//  can simply move this if statement to above the push data line, and just return from it if we hit the max condition. This 
//  should fix our problem.
      const inStream = new Readable({
          read(size) {
            setTimeout(() => {
            
              if(this.currentCharCode > 90) this.push(null);
              
              this.push(String.fromCharCode(this.currentCharCode++));
          }, 100);
        });
        
//  Let's now register a process on exit event, and in there let's write to the error console the current character code that we 
//  have in our inStream.
    process.on('exit', () => {
      `\n\n Current Char Code is ${inStream.currentCharCode}`
    );
    
//  What I want to do now is to read only three characters from our inStream and make sure that not all the 
//  data gets buffered.
  $node thisfile.js | head -c3
   
//  head command will cause the node process to exit and we'll see our currentCharCode value, which is only at 69, which is D. So 
//  data is only pushed to this readable stream on demand here. The head command causes this error on the standard out, which 
//  goes unhandled and forces the process to exit, but we can suppress this error message by officially registering a handler for 
//  the error event on stdout and just call process.exit in there. This will make our script return the three characters cleanly.

   //at end of file write
   process.stdout.on('error', process.exit);
