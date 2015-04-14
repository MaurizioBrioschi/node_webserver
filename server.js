var http = require('http');
var path = require('path');

var pages = [{
  route: '',
  output: 'rock it!'
}, {
  route: 'about',
  output: 'I\'m a rock\'n roll star'
}, {
  route: 'skate',
  output: function() {
    return 'skate it!\n' + this.route;
  }
}, ];

http.createServer(function(request, response) {
  var lookup = path.basename(decodeURI(request.url));
  pages.forEach(function(page) {
    if (page.route === lookup) {
      response.writeHead(200, {
        'Content-Type': 'text/html'
      });
      response.end(typeof page.output === 'function' ? page.output() : page.output);
    }
  });
  if (!response.finished) {
    response.writeHead(404);
    response.end('Page Not Found!');
  }
}).listen(8069);
