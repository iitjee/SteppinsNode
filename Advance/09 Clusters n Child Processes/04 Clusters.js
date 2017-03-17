The cluster module can be used to enable load balancing over an environment multiple CPU cores. It's based on the fork 
function that we've seen in the previous clip and it basically allows us to fork our main application process as many times as 
we have CPU cores, and then it will take over and load balance all requests to the main process across all forked processes. 



The cluster module is Node's helper for us to implement the cloning scalability strategy, but only on one machine. So when you 
have a big machine with a lot of resources or when it's easier and cheaper to add more resources to one machine rather than 
adding new machines, then the cluster module is a great option for a really quick implementation of the cloning strategy. 

Even small machines usually have multiple cores, and even if you're not worried about the load on your Node server, you should 
enable the cluster module anyway to increase your server availability and fault-tolerance. It's a simple step and when using a 
process manager like pm2 for example, it becomes as simple as just providing an argument to the launch command! But I'm going 
to show you how use the cluster module natively and explain how it works.

..still there
