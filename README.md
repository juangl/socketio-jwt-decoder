# Socket.io JWT decoder

[![Build Status master](https://secure.travis-ci.org/juangl/socketio-jwt-decoder.svg)](http://travis-ci.org/juangl/socketio-jwt-decoder)
[![Dependency Status](https://david-dm.org/juangl/socketio-jwt-decoder.svg)](https://david-dm.org/juangl/socketio-jwt-decoder)
[![devDependency Status](https://david-dm.org/juangl/socketio-jwt-decoder/dev-status.svg)](https://david-dm.org/juangl/socketio-jwt-decoder#info=devDependencies)


> Authenticate socket.io incoming connections with JWTs. This is useful if you are build a single page application and you are not using cookies as explained in this blog post: [Cookies vs Tokens. Getting auth right with Angular.JS](http://blog.auth0.com/2014/01/07/angularjs-authentication-with-cookies-vs-token/).

* Socket.io JWT decoder just works for Socket.IO >= 1.0. *

## Installation

```
npm install socketio-jwt-decoder
```

## Example usage

The previous approach uses a second roundtrip to send the jwt, there is a way you can authenticate on the handshake by sending the JWT as a query string, the caveat is that intermediary HTTP servers can log the url.

```javascript
var io            = require("socket.io")(server);
var socketioJwt   = require("socketio-jwt-decoder");


io.use(socketioJwt.authorize({
  secret: 'your secret or public key',
  otherOption: someValue // you can pass other arguments to jsonwebtoken
}));


io.on('connection', function (socket) {

  if (socket.decoded_token) { // authentication successful
    console.log('hello!', socket.handshake.decoded_token.name);
  }

})
```

For more validation options see [auth0/jsonwebtoken](https://github.com/auth0/node-jsonwebtoken).

__Client side__:

Append the jwt token using query string:

```javascript
var socket = io.connect('http://localhost:9000', {
  'query': 'token=' + your_jwt
});
```

## Handling token expiration

__Server side__:

When you sign the token with an expiration time:

```javascript
var token = jwt.sign(user_profile, jwt_secret, {expiresInMinutes: 60});
```

Your client-side code should handle it as below.

__Client side__:

```javascript
socket.on("error", function(error) {
  if (error.type == "UnauthorizedError" || error.code == "invalid_token") {
    // redirect user to login page perhaps?
    console.log("User's token has expired");
  }
});
```

## Contribute

You are always welcome to open an issue or provide a pull-request!

Also check out the unit tests:
```bash
npm test
```

## License

Licensed under the MIT-License.
2015 Juan Jesús García López
