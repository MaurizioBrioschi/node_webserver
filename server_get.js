var http = require('http'),
  querystring = require('querystring'),
  util = require('util'),
  form = require('fs').readFileSync('content/form.html');
http.createServer(function(request, response) {
  if (request.method === "POST") {
    var postData = '';
    request.on('data', function(chunk) {
      postData += chunk;
    }).on('end', function() {
      var postDataObject = querystring.parse(postData);
      console.log('User Posted:\n', postData);
      response.end('You Posted:\n' + util.inspect(postDataObject));
    });
  }
  if (request.method === "GET") {
    response.writeHead(200, {
      'Content-Type': 'text/html'
    });
    response.end(form);
  }
}).listen(8080);
