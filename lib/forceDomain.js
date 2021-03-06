'use strict';

var redirect = require('./redirect');

var forceDomain = function (options) {
  return function (req, res, next) {

    if (!req.headers['x-forwarded-proto']) {
      return next();
    }

    var protocol = req.headers['x-forwarded-proto'] || req.protocol;
    var newRoute = redirect(protocol, req.headers.host, req.url, options),
        statusCode;

    if (!newRoute) {
      return next();
    }

    statusCode = (newRoute.type === 'temporary') ? 307 : 301;

    res.writeHead(statusCode, {
      Location: newRoute.url
    });
    res.end();
  };
};

module.exports = forceDomain;
