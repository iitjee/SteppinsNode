var https = require('https'),
    fs = require('fs');

var options = {
	hostname: 'en.wikipedia.org',
	port: 443,
	path: '/wiki/George_Washington',
	method: 'GET'
};

var req = https.request(options, function(res) {
	var responseBody = "";
	console.log(`server has started with status code: ${res.statusCode}`);
	res.setEncoding('UTF-8');

	res.on('data', function(chunk) {
		console.log(`chunk length is ${chunk.length}`);
		responseBody += chunk;
	});

	res.on('end', function() {
		console.log(responseBody);
		console.log('successfully completed vikhyath');
	});
	});

req.on('error', function(err) {
	console.log(`problem with req: ${err.message}`);
});

req.end();
