var http = require('http');
var path = require('path');
var fs = require('fs');

var pages = [{
  route: '/',
  output: 'rock it!'
}, {
  route: '/about',
  output: 'I\'m a rock\'n roll star'
}, {
  route: '/snowboard/trick',
  output: 'my snowboard tricks'
}, {
  route: '/skate',
  output: function() {
    return 'skate it!\n' + this.route;
  }
}, ];

var mimeTypes = {
  '.js': 'text/javascript',
  '.html': 'text/html',
  '.css': 'text/css'
};
//cache
var cache = {};

function cacheAndDeliver(f, cb) {
    fs.stat(f, function(err, stats) {
      if (err) {
        return console.log('Oh no!, Eror', err);
      }

      var lastChanged = Date.parse(stats.ctime),
        isUpdated = (cache[f]) && lastChanged > cache[f].timestamp;

      if (!cache[f] || isUpdated) {
        fs.readFile(f, function(err, data) {
          console.log('loading ' + f + ' from file');
          if (!err) {
            cache[f] = {
              content: data,
              timestamp: Date.now() //store a Unix
            };
          }
          cb(err, data);
        });
        return;
      }
      console.log('loading ' + f + ' from cache');
      cb(null, cache[f].content);
      return;
    }); //end of fs.stat

  }
  /**
  here the script to create the server
  **/
http.createServer(function(request, response) {
  var lookup = decodeURI(request.url) || 'master.html';

  pages.forEach(function(page) {
    if (page.route === lookup) {
      response.writeHead(200, {
        'Content-Type': 'text/html'
      });
      response.end(typeof page.output === 'function' ? page.output() : page.output);
    }
  });
  var f = 'content/' + lookup;
  fs.exists(f, function(exists) {
    if (exists) {
      cacheAndDeliver(f, function(err, data) {
        if (err) {
          response.writeHead(500);
          response.end('Server Error!');
          return;
        }
        var headers = {
          'Content-type': mimeTypes[path.extname(lookup)]
        };
        response.writeHead(200, headers);
        response.end(data);
      });
      return;
    }
    response.writeHead(404); //no such file found!
    response.end();
  });
}).listen(8080);
