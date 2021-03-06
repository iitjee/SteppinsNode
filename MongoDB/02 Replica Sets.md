Replica Sets

Things don't always go our way. Sometimes your server will crash, and when that happens, what's going to happen to your application? It's going to be hosed, it's not going to have anywhere to write or read data, probably not going to work too well.

If you're well prepared, you have a backup, and then you'll spend some time restoring the server from the backup, and after you're done if everything is okay you'll bring the server backup, your application is happy again. That's the traditional way of doing things. But we can do much better than that. How about using some replication? 

MongoDB supports an arrangement called a replica set. The members of a replica set are a primary, secondary or a number of secondaries, and potentially an arbiter. Let's look at the roles of each one of those in a replica set.

![image](https://cloud.githubusercontent.com/assets/20602254/24086185/f947f872-0d30-11e7-9518-0025f21f46da.png)

The primary database is the one and only writeable instance in a replica set. That means that any and all clients that want to write data to the database have to be connected to the primary and have to issue the write commands against the primary. An attempt to write to a secondary will fail.

The secondary databases are read only instances. I mention them as plural, you can have many secondary databases. This means that you also have scalability because you can perform many, many more reads against the replicas rather than attacking a single server with all your requests to write and read. Now in the secondary databases, the data is going to be replicated from the primary eventually. That's what we call eventual consistency.

At some point, if the primary database is going to fail, one of the secondaries will take over and will become the primary. This is great because you get automatic recovery from a crash of the primary and gives your farm resilience against a single server failure. If one of the secondaries fail, it's no big deal because you have still the primary and you can issue reads against the primary, and depending on your farm size, you may also have other secondaries to read from, no data loss and no loss of functionality.

The third type of member in a replica set is the <b>arbiter</b>. I mentioned before that if the primary server was to fail, one of the secondaries will take over. The question is which one? Surely only one should become primary at any given moment. So what Mongo does is it holds an election, and the election rules are that you have to have a majority, a simple majority, more than 50% in order to allow any server to become primary, including the old primary by the way. So if you had an even number of servers, say one primary, one secondary, and the primary has disappeared for some reason, the secondary will not become the primary. Why? Because it's the only voter.

The math for an election is pretty simple. If you start a replica set with say three members, then there are three members altogether. Primary fails, now there are two members remaining. Each one has a vote. If they both vote for the same machine and the arbiter will always vote for somebody else, so the secondary and the arbiter will all vote for the secondary, that's two out of three, that's a majority, no problem, the secondary will take over. 

If you had only the primary and the secondary, those are two machines. If the primary fails, the remaining machine has one vote to cast, one out of two. That's exactly 50%, that is not a simple majority, it needs to have slightly more than 50%, and it doesn't have it. In that case, the secondary will not take over. We need some way to influence this election. So the arbiter will provide an additional vote. An arbiter is also special in that it does not have any data on it, its sole purpose in life is to break the tie on an election. Because of that, an arbiter could be a much smaller machine, it doesn't need to have a lot of disk or a lot of memory, all it wants to do is be around for an election should an election happen and break the tie. 

You don't have to have an arbiter.If you have an odd number of servers in the farm, a single machine failure will still leave behind it enough machines to hold an election and to break the tie amongst themselves. Setting up a replica set is not much more difficult than starting a single server. If you plan on going into production with just a single server, you will run the risk of having no database while you are recovering, but with a replica set, you can have automatic recovery. 

So let's set up one. We will designate three servers, that's the minimal replica set possible.
- A primary DB, 
- a single secondary DB, 
- and one arbiter.

We'll run it all on one machine so I'll have to run them on different TCP ports so that they can listen and talk to each other, but other than that you can pretty much run a replica set on a single server and try it at home. In production, of course you would run one Mongo server per machine, you're not going to run them all on the single server. Although the arbiter is quite lite, you don't want to put it at risk of a single machine failure.
