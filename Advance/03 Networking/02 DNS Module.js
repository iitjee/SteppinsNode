
DNS Modules: we can use it to translate network names to addresses and vice-versa

  const dns = require('dns');

  dns.lookup('github.com', (err, address) => {
    console.log(address);
  });

The lookup method on the DNS module is actually a very special one, because it does not necessarily perform any network communication, and 
instead uses the underlying operating system facilities to perform the resolution. This means that it will be using libuv threads. 
All the other methods on the DNS module uses the network directly and does not use libuv threads. 

For example, the equivalent network method for lookup is resolve4, 4 is the family of IP address, so we're interested in IPv4 addresses. And this will give us an array of addresses in case the domain has multiple A records, which seems to be the case for github.com. If we just use resolve, instead of resolve4, the default second argument here is A, which is an A record so this is what just happened, but we can also resolve other types, like for example, if we're interested in MX record we just do that, and here are all the MX records for Pluralsight.com. You can tell they're using Google apps. And all the available types also have equivalent method names, so MX here is the same as resolving with the MX argument. Another interesting method to know about is the reverse method. The reverse method takes in an IP, so let's actually pass one of the IPs for Pluralsight, and it gives us a callback error first and hostnames, so it translates an IP back to its host names. Let's test that, and you'll notice that it translates this IP back to an Amazon AWS hostname. If we actually tried to open this in a browser it will probably go to Pluralsight.com. There you go.





