var express = require('express');
var http = require('http');

var socketIo = require('socket.io');
var socketio_jwt = require('../../lib');

var jwt = require('jsonwebtoken');


var server, sio;

exports.start = function (callback) {


  options = {
    secret: 'aaafoo super sercret',
    timeout: 1000
  };

  var app = express();
  var bodyParser = require('body-parser');
  app.use(bodyParser.urlencoded());
  app.use(bodyParser.json());

  app.post('/login', function (req, res) {
    var profile = {
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@doe.com',
      id: 123
    };

    // We are sending the profile inside the token
    var token = jwt.sign(profile, options.secret, { expiresInMinutes: 60*5 });

    res.json({token: token});
  });

  server = http.createServer(app);

  sio = socketIo.listen(server);
  sio.use(socketio_jwt.authorize(options));

  sio.sockets.on('echo', function (m) {
    sio.sockets.emit('echo-response', m);
  });

  server.__sockets = [];
  server.on('connection', function (c) {
    server.__sockets.push(c);
  });
  server.listen(9000, callback);
};

exports.stop = function (callback) {
  sio.close();
  callback();
};
