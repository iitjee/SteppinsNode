Working with big amounts of data in Node.js means working with streams.  there are a lot of Node packages out there with the 
sole purpose of making working with streams easier.

Streams, most importantly, give you the power of composability in your code. Just like you can compose powerful Linux 
commands by piping other smaller commands, you can do exactly the same in Node with Streams. Many of the built-in modules in 
 Node implement the streaming interface. 

eg: while an HTTP response is a readable stream on the client, it is a writable stream on the server, because basically one 
object generates the data and the other object consumes it. Note also how the stdin/out and error streams are the inverse 
type when it comes to child processes, which we will talk about next .

A stream is an abstract interface for working with streaming data in Node.js. The stream module provides a base API that 
makes it easy to build objects that implement the stream interface.
Or in other words,
 Streams are simply collections of data, just like arrays or strings, with the difference that they might not be available 
 all  at once and they dont have to fit in memory, which makes them really powerful for working with large amounts of data 
 or data thats coming from an external source one chunk at a time. 
 //create-file.js
      const fs = require("fs");
      const file = fs.createWriteStream('./bigfile');

      for(let i=0; i<1e6; i++) {
        file.write('asdfj sldfj lsakdjfal ;sdkfja sdk fjlasdkfjla;sd fjkl sdjf kasjdf;lk dsjf laksdjf a;sdkfj ;dlakjf');
      }

      file.end()

Runnign above code will create a file of some memoery


//So now, we'll serve this file in a simple http server using the readFile method and writing the response inside its
//callback.
      //server.js
      const fs = require("fs");
      const server = require("http").createServer();

      server.on('request', (req, res) => {
        fs.readFile('./bigfile', (err, data) => { //reads file
          if(err) throw err;
          res.end(data); //writes data
        });
      });
      server.listen(8000);
$node server.js

//open another terminal and request the server
$curl -i localhost:8000

The server's memory usage immediately jump to over 400 MB of memory. That's because our code basically buffered the whole big 
file in memory before it wrote it out. This is very inefficient.

Luckily, we dont have to do that in Node. The response object is also a writable stream. Remember how we streamed data with 
timers when we were talking about the HTTP server? And we used .write and .end on this response object, the same methods we 
just used to create the big file with the stream. Since this response is a writable stream, if we have the big file as a 
readable stream, we can simply pipe one into the other and avoid filling up the memory. 

The fs module can give a readable 
stream for any file using this createReadStream method and then we simply pipe this readable stream into the response 
writeable stream.
      //server.js
      const fs = require("fs");
      const server = require("http").createServer();

      server.on('request', (req, res) => {
        const src = fs.createReadStream('./big.file');
        src.pipe(res); //this will transmit data only in chunks
      });
      server.listen(8000);

Now see in the Activiy Monitor. Not only is this code a more elegant version of what we had before, but it's also a much 
better way to deal with this data.

//Infact, let's push to limits
in crate-file.js
      for(let i=0; i<5e6; i++) { //make it 5 million. This will be around 2GB
and run both the versions.

The buffered version will fade out as it's more than the default limit and stream works just fine!
