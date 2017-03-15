Congratulations, your application is very popular, and now you're facing a scalability challenge. What are some of the causes of scalability issues in relational databases?

The relational model itself requires a relational database engine to manage rights in a very special way. To assure consistency and atomicity, it must lock rows and tables and only allow one writer access at a time. Protecting referential integrity across several tables and rows increases the time the lock has to be in effect. Increased locking time means less rights or updates per second, means higher latency of transactions, means slower application. [LOCKING]

Scaling out and replicating data to other servers can make things worse. If relational engines try to enforce consistency and extend these locks across the network, lock times are then longer, transaction latency is higher. This will actually make applications even slower.


How do we solve these issues in relational databases? By de-normalizing tables, we can speed things up. When a lock is taken, it's taken on a single table and not several tables, so that can reduce latency. But then we abandon the relational goodness that caused us to use the relational database in the first place. We can also relax the consistency model, say allow for dirty reads, allow for reading data before it was fully committed. But then we might lose some of the durability or consistency guarantees of the engine.


How does Mongo approach these issues? MongoDB has no schema, no tables, no rows, no columns and tables, and certainly no relationships between tables.<b> In Mongo, you have single document write scope. A document lives in a collection, but updating documents occur one at a time. So if any locking needed to occur, it will be much simpler, there's no need to extend locks across collections, there are no relationships to enforce. Further, there is no schema to protect. </b>

So whereas you could have had two tables and when you wanted to update both, you needed to lock both tables. In MongoDB, there's no such requirement, so locking can be much faster. In replication scenarios, Mongo lets you choose the consistency you want. Mongo does not let you lock across several Mongo servers. A replication set in Mongo consists of a single server, which will accept all rights and several secondary servers, which will be replicated too, but there are no locks extended from the primary to the secondaries. 

Now you can choose the consistency model you want. Your application can send a command to update a document on the server and wait until that document has been replicated to all servers involved, or it can choose to only wait for the primary to persist that document, or it can choose that a majority of the servers will be written to before the write was acknowledged, or it can choose to hand over the document to primary and not even care whether it was persisted or not. It's up to you. Your application decides if it wants higher latency, but absolute consistency or relaxed consistency and some guarantee of durability. Not having to wait until a document was written eventually to all databases means the server returns control to the application faster and your application can be freed up to do other things faster. 

Mongo also offers a special collection called a capped collection. Capped collections have a fixed size and automatically overwrite older documents. Because it has fixed size, it does not need to spend any time allocating space for new documents. If you want to ingest many, many documents in a very high clip, you should consider using a capped collection in Mongo.



[DATA CONSISTENCY] Data consistency is pretty important, so it's worth taking a closer look. In a single database scenario, let's say we have two persons(observors), A and B, and there's a document with a value X equals 123. At some point, A decides to update that document, let's say assigning 789 to X. Now, during that update, B's observation can either be the record just before A made the update, meaning 123, or just after if it waited for the lock to be released.

When you scale out, things become a little more involved. Let's say again you have two observers and you have a primary database and a secondary database. Mongo only accepts rights into the primary database at the time. 

So let's say A updates a document. It sets the value of X to 789. Replication must then occur to take that value and update it also in the secondary database, and eventually the value will be replicated and both the primary and the secondary will contain the same exact data in that document. If we take a step backwards, there is a lag of time in which A may have observed that that document has already been updated, but B has not seen that update occur yet. That's because the secondary database doesn't have the data replicated to it yet. This is what is termed eventual consistency. 

![image](https://cloud.githubusercontent.com/assets/20602254/23928505/1eb9a8a6-0946-11e7-8999-ca5804ee7b10.png)

Eventually, the document will make it over to the secondary database. As I mentioned before, you choose what consistency and durability model you want Mongo to support you on. It's important to distinguish between durability and consistency in the context of eventual consistency. Durability is about whether your data was persisted to durable media before control was returned to you. 
![image](https://cloud.githubusercontent.com/assets/20602254/23928536/443ca38a-0946-11e7-8a97-73e64a85a8f1.png)

Eventual consistency in a replica set has to do with whether a document was written to all of the servers, to the primaries and secondaries before control was returned to your application. If you want complete consistency before control is returned to your application, you issue an update command or a write command to the primary and control is not returned to you until that document update made it to all servers involved. 

You can also choose very limited durability guarantee in a fire and forget manner, just hand over your update command to the primary, control will be returned to you immediately if it received it in memory, but no guarantee has been made that that document made it to disk. If everything went well, it will be durable and constant. Mongo will take that update, apply it to the primary, replicate it to the secondaries, and everything will be consistent. There is a slight chance, however, if a primary fails before the document has been made durable on disk, that that record will be lost. You can also choose that a document will be replicated to a majority, or any other number of secondaries. You give the primary your update command, it replicates to a majority or to a specified number of secondaries, and then returns control to you. Mongo then continues and replicates to the rest of the secondaries, but control has already been returned to your application.




[INCONSISTENCY]
So we have all of these consistency and durability choices, why is it so important to know about those? Well, in a multiple server scenario, there's a chance that during the replication lag, A and B might communicate via other means, another connection, another application, messaging. At that point, the observation of B, B's knowledge of what the document value is, and A's knowledge of what the document is are inconsistent.

![image](https://cloud.githubusercontent.com/assets/20602254/23928777/cde8441c-0947-11e7-8b23-6acebeb38640.png)

So you should inspect your application and figure out if those are concerns you have. You can certainly point B to read from the primary server, but then it won't be as scalable or as fast. Part of the reason you employ replication is to allow readers to read from the secondaries, reducing the pressure on the primary. But the importance of consistency really depends on your application. In many, many scenarios, the small replication lag is not an issue, but in some scenarios it is, and you will have to make your own judgement.



[Schema Responsibility Shift]
For decades now, we've been building applications using relational databases and we've been accustomed to the database engine enforcing schema for us. Having no schema and having Mongo not enforce or require a schema might be jarring to some. It certainly shifts the responsibility of schema enforcement to your application. That can be good news or bad news depending on your view of things, but it's certainly true that MongoDB does not offer you any schema enforcement, it is the responsibility of your application to both define and enforce schema if it wishes to. But this might also open opportunities to your application because it need not worry so much about document structure when it writes documents. So you can have scenarios where you write various documents into collections and deal with a variety of schemas later when you process those records.
