So if we had a Mongo database or SQL database that's connected to the server, what we would do first is basically call on to 
that server and get the data, so like we've done here. We've imported the data, but let's say, for example, we had a Mongo DB 
connected. We would need to get the data first, and return it, and then send it to our client.


        app.get('/', (req, res) => {
          res.json(data)
        });
        
        
You can see that mockaroo.com data in the postman get.
also you can see this data on the client side i.e in the chrome


Now we can do all the front-related designs with this data! Ta Da!
