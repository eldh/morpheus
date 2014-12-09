'use strict';

var util = require('util');
var serverUtils = require('../utils').server;
var React = require('react');
var appAction = require('../actions/ApplicationAction');

module.exports = function(log) {
  return function(err, req, res, next) { // jshint ignore:line
    log.error({
      err: err.stack
    }, 'There was an error while handling the request');
    if (!err.statusCode) {
      err.statusCode = err.status ? err.status : 500;
    }
    if (err.statusCode === 404) {
      err.message = util.format('page %s not found', req.protocol + '://' + req.get('host') + req.originalUrl);
    }
    if (err.statusCode === 500) {
      err.message = err.message ? err.message : 'Internal Server Error';
    }
    res.status(err.statusCode);
    res.format({
      'html': function() {
        var context = res.locals.context;
        var fluxibleApp = res.locals.fluxibleApp;
        context.getActionContext().executeAction(appAction.error, {
          err: {
            message: err.message,
            status: err.statusCode
          }
        }, function() {
          res.status(err.statusCode);
          var AppComponent = fluxibleApp.getAppComponent();
          var markup = React.renderToString(AppComponent({ //jshint ignore:line
            context: context.getComponentContext()
          }));
          res.expose(fluxibleApp.dehydrate(context), 'App');
          serverUtils.render(res, markup);
        });
      },
      'json': function() {
        res.send({
          error: err.message || 'Unexpected error'
        });
      },
      'default': function() {
        res.send();
      }
    });
  };
};
