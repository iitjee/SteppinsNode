// With Duplex streams, we can implement both a readable and writable stream with the same object. It's as if we can inherit from 
// both interfaces.

  const { Duplex } = require('stream');

  const inoutStream = new Duplex({
    write(chunk, encoding, callback) {
      console.log(chunk.toString());
      callback();
    },

    read(size) {
      if(this.currentCharCode > 90) {
        this.push(null);
        return;
      }
      this.push(String.fromCharCode(this.currentCharCode++));
    }
  })
  inoutStream.currentCharCode = 65;
  process.stdin.pipe(inoutStream).pipe(process.stdout);

// By combining the streams here, we can use this duplex stream to read the letters from A to Z and we can also use it for its 
//echo feature. We pipe the standard in into this duplex stream to use the echo feature, and we pipe the duplex stream itself 
//into the standard out to read the letters A through Z. It's extremely important to understand that the readable and writable 
//sides of a duplex stream operate completely independently from one another. This is merely a grouping of two features into 
//one object.


//A transform stream is the more interesting duplex stream, because its output is computed from its input. We don't have to 
//implement read or write. We only need to implement a transform method, which combines both of them. It has the signature of 
//the write method and we can use it to push data as well.
const { Transform } = require('stream');

const upperCaseTr = new Transform({
  transform(chunk, encoding, callback) {
    this.push(chunk.toString().toUpperCase());
    callback();// And we still need to call the callback, just like in the write method. This stream effectively implements 
    // the same echo feature, but converting the input into uppercase first.
  }
});
process.stdin.pipe(upperCaseTr).pipe(process.stdout);
