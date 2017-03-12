There are four fundamental stream types in Node.js: Readable, Writable, Duplex, and Transform. 

- A readable stream is an abstraction for a source from which data can be consumed. An example of that is the fs.createReadStream method. 

- A writable stream is an abstraction for a destination to which data can be written. An example of that is the fs.createWriteStream method.

- Duplex streams are both Readable and Writable, like a socket for example (net.socket), and 

- Transform streams are basically duplex streams that can be used to modify or transform the data as it is written and read. An example of that is the zlib createGzip stream to compress the data using gzip. You can think of a transform stream as a function where the input is the writable stream part and the output is readable stream part. You might also hear transform streams referred to as "through streams." 

All streams are instances of EventEmitter. They all emit events that we can use to write or read data from them. However, we can consume streams in a simpler way using the pipe method. 
        src.pipe(dist);
        
In this simple line, we're piping the output of a readable stream, src, as the input of a writable stream, destination. Src has to be a readable stream and destination has to be a writeable stream here. They can both, of course, be duplex streams as well. In fact, if we're piping into a duplex stream, we can chain pipe calls just like we do in Linux.
Linux: a|b|c|d
Node: a.pipe(b).pipe(c).pipe(d); (given that both b and c are both duplex streams)
Node: a.pipe(b); b.pipe(c); c.pipe(d); (also the same)

Note that we talk about streams in Node there are two main different things about them. There is the task of implementing the streams and there is the consuming of the streams. 

Stream implementers are usually who use the stream module.
For consuming, all we need to do is either use pipe or listen to the stream events.
 
 Readable and writable streams have events and functions that are somehow related. We usually use them together. Some of events are similar, like the error and close events, and others are different. 
 
 The most important events on a readable stream are the data event, which is emitted whenever the stream passes a chunk of data to the consumer, and the end event, which is emitted when there is no more data to be consumed from the stream. 
 
 The most important events on a writable stream are the drain event, which is a signal that the writable stream can receive more data, and the finish event, which is emitted when all data has been flushed to the underlying system.
 
 To consume a readable stream, we use either the pipe/unpipe methods, or the read/unshift/resume methods, and to consume a writable stream, we just write to it with the write method and call the end method when we're done. 
 
 Readable streams have two main modes that affect the way we consume them. They can be either in the paused mode or in the flowing mode. Those are sometimes referred to as pull vs. push modes. All readable streams start in the pause mode, but they can be easily switch into flowing and back to paused where needed. 
 
 In Paused mode, we have to use the stream.read() method to read from the stream, while in the flowing mode, the data is continuously flowing and we have to listen to events to consume it. 
 In the flowing mode, data can actually be lost if no consumers are available to handle it, this is why when we have a readable stream in flowing mode, we need a 'data' event handler. In fact, just adding a data event handler switches a paused stream into flowing mode, and removing the data handler switches it back to paused mode. Some of this is done for backward compatibility with the older stream interface in node. 
 
 Usually, to switch between these two modes, we use the stream.resume and stream.pause methods.

