var jwt = require('jsonwebtoken');
var UnauthorizedError = require('./UnauthorizedError');

function authorize(options) {
  return function(socket, next){
    var token, error;
    var req = socket.handshake
    var authorization_header = (req.headers || {}).authorization;

    if (authorization_header) {
      var parts = authorization_header.split(' ');
      if (parts.length == 2) {
        var scheme = parts[0],
          credentials = parts[1];

        if (scheme.toLowerCase() === 'bearer') {
          token = credentials;
        }
      } else {
        error = new UnauthorizedError('credentials_bad_format', {
          message: 'Format is Authorization: Bearer [token]'
        });
        return next(error);
      }
    }

    else if (req.query && req.query.token) {
      token = req.query.token;
    }

    jwt.verify(token, options.secret, options, function(err, decoded) {

      if (err) {
        error = new UnauthorizedError('invalid_token', err);
        return next(error);
      }

      socket.decoded_token = decoded;
      next();
    
    });

    if (!token) {
      next(); // if there is not token, just pass    
    }
  };
}

exports.authorize = authorize;
