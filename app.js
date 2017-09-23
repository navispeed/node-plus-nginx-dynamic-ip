var express = require('express');
var path = require('path');

var index = require('./routes/index');
var config = require("./helpers/config.js");

var app = express();

app.use('/', index);

config.init();
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500).json({error: "error"});
});

module.exports = app;
